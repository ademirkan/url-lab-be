import base64

def hash_url(number):
    # Get a hash value of the number
    hashed = hash(number)
    # Convert to bytes
    hashed_bytes = hashed.to_bytes((hashed.bit_length() + 7) // 8, 'big')
    # Encode to base64, slice first 5 characters
    hashed_base64 = base64.b64encode(hashed_bytes)[:5]
    # Convert to string
    return hashed_base64.decode()