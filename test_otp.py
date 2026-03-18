from database import store_otp, verify_otp, get_user_by_identifier

# Test get_user_by_identifier
name_by_email = get_user_by_identifier("test@example.com")
name_by_number = get_user_by_identifier("1234567890")
print(f"Name by email: {name_by_email}")
print(f"Name by number: {name_by_number}")

# Test store_otp
identifier = "test@example.com"
otp = "123456"
success = store_otp(identifier, otp)
print(f"Store OTP success: {success}")

# Test verify_otp
valid = verify_otp(identifier, otp)
print(f"Verify OTP (correct): {valid}")

valid_again = verify_otp(identifier, otp)
print(f"Verify OTP again (should be false, as it's deleted): {valid_again}")

valid_wrong = verify_otp(identifier, "000000")
print(f"Verify OTP (wrong): {valid_wrong}")
