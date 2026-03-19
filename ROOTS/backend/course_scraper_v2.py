import requests
from bs4 import BeautifulSoup
import sqlite3
import re
import time
import pandas as pd
from urllib.parse import quote

class CourseScraper:
    def __init__(self, db_name=None):
        if db_name is None:
            # Point to the database folder
            self.db_name = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'database', 'courses.db')
        else:
            self.db_name = db_name
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        self.init_db()

    def init_db(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT,
                title TEXT,
                url TEXT UNIQUE,
                status TEXT,
                last_checked DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def is_link_valid(self, url):
        try:
            response = requests.head(url, headers=self.headers, timeout=5, allow_redirects=True)
            return response.status_code == 200
        except:
            try:
                # Fallback to GET if HEAD is not allowed
                response = requests.get(url, headers=self.headers, timeout=5)
                return response.status_code == 200
            except:
                return False

    def save_to_db(self, platform, title, url):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO courses (platform, title, url, status)
                VALUES (?, ?, ?, ?)
            ''', (platform, title, url, 'Free'))
            conn.commit()
        except Exception as e:
            print(f"Error saving to DB: {e}")
        finally:
            conn.close()

    def search_courses(self, topic):
        """Searches for free courses on a specific topic across all platforms."""
        print(f"\n[!] Starting targeted search for: '{topic}'")
        results = []
        results.extend(self.scrape_coursera(query=topic))
        results.extend(self.scrape_gfg(query=topic))
        results.extend(self.scrape_youtube(topic=f"{topic} free course"))
        
        print(f"\n[+] Search for '{topic}' completed. Found {len(results)} valid free links.")
        return results

    def scrape_coursera(self, query="free"):
        print(f"[*] Scraping Coursera for '{query}'...")
        # If the query is just "free", we use the default free courses page
        if query.lower() == "free":
            url = "https://www.coursera.org/courses?query=free"
        else:
            url = f"https://www.coursera.org/courses?query={quote(query)}%20free"
            
        courses = []
        try:
            r = requests.get(url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(r.text, 'html.parser')
            
            for h3 in soup.find_all('h3'):
                title = h3.get_text(strip=True)
                parent_a = h3.find_parent('a')
                if parent_a and 'href' in parent_a.attrs:
                    link = parent_a['href']
                    if not link.startswith('http'):
                        link = "https://www.coursera.org" + link
                    
                    if self.is_link_valid(link):
                        courses.append(('Coursera', title, link))
                        self.save_to_db('Coursera', title, link)
        except Exception as e:
            print(f"Coursera Error: {e}")
        return courses

    def scrape_gfg(self, query=None):
        print(f"[*] Scraping GeeksforGeeks for '{query if query else 'free courses'}'...")
        if query:
            url = f"https://www.geeksforgeeks.org/courses?search={quote(query)}&courseType=free"
        else:
            url = "https://www.geeksforgeeks.org/courses?courseType=free"
            
        courses = []
        try:
            r = requests.get(url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(r.text, 'html.parser')
            
            for h4 in soup.find_all('h4'):
                title = h4.get_text(strip=True)
                # Filtering based on query if provided
                if query and query.lower() not in title.lower():
                    continue
                    
                parent_card = h4.find_parent('div')
                card_text = parent_card.get_text() if parent_card else ""
                if "₹" in card_text and "FREE" not in card_text.upper():
                    continue 
                
                parent_a = h4.find_parent('a') or (parent_card.find('a') if parent_card else None)
                if parent_a and 'href' in parent_a.attrs:
                    link = parent_a['href']
                    if not link.startswith('http'):
                        link = "https://www.geeksforgeeks.org" + link
                    
                    if self.is_link_valid(link):
                        courses.append(('GeeksforGeeks', title, link))
                        self.save_to_db('GeeksforGeeks', title, link)
        except Exception as e:
            print(f"GFG Error: {e}")
        return courses

    def scrape_youtube(self, topic="python course free"):
        print(f"[*] Scraping YouTube for '{topic}'...")
        search_url = f"https://www.youtube.com/results?search_query={quote(topic)}"
        courses = []
        try:
            r = requests.get(search_url, headers=self.headers, timeout=10)
            video_ids = re.findall(r"watch\?v=([a-zA-Z0-9_-]{11})", r.text)
            unique_ids = list(dict.fromkeys(video_ids))
            
            for vid in unique_ids[:5]: # Reduced limit for faster searching
                video_url = f"https://www.youtube.com/watch?v={vid}"
                try:
                    vr = requests.get(video_url, headers=self.headers, timeout=5)
                    vsoup = BeautifulSoup(vr.text, 'html.parser')
                    title = vsoup.title.string.replace(" - YouTube", "") if vsoup.title else "YouTube Video"
                    
                    # Ensure it's related to the topic
                    if "free" in title.lower() or "course" in title.lower():
                        courses.append(('YouTube', title, video_url))
                        self.save_to_db('YouTube', title, video_url)
                except:
                    continue
        except Exception as e:
            print(f"YouTube Error: {e}")
        return courses

    def run(self):
        # Default run scrapes general free courses
        self.scrape_coursera()
        self.scrape_gfg()
        self.scrape_youtube()
        print("\n[+] General Scraping Complete.")

if __name__ == "__main__":
    scraper = CourseScraper()
    
    # Example 1: Run general scrape
    # scraper.run()
    
    # Example 2: Targeted Search via the new function
    user_query = input("Enter a topic to search for free courses: ").strip()
    if user_query:
        scraper.search_courses(user_query)
    else:
        scraper.run()
    
    # Display final results from DB
    conn = sqlite3.connect(scraper.db_name)
    df = pd.read_sql_query("SELECT platform, title, url FROM courses ORDER BY id DESC", conn)
    print(f"\nTotal Free Courses in Database: {len(df)}")
    print(df.head(15))
    conn.close()

