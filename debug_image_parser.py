import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from app.services.pdf_parser import BudgetPDFParser

def debug_parsing():
    # Use the absolute path to the uploaded image from the context
    image_path = r"C:/Users/ASUS/.gemini/antigravity/brain/6f16e9ad-8736-4a03-8c35-54067b7534ce/uploaded_media_1770324257834.png"
    
    print(f"--- Debugging Image: {image_path} ---")
    
    parser = BudgetPDFParser()
    
    try:
        # We call parse_image directly
        items = parser.parse_image(image_path)
        
        print(f"\n--- Found {len(items)} items ---")
        for item in items:
            print(item)
            
        if not items:
            print("\nNO ITEMS FOUND. Checking internal logic...")
            # We can't easily see inside the method unless we modified generic prints, 
            # which we did in the previous step.
            # So the output of this script should ALREADY contain the "DEBUG: OCR extracted..." lines
            # because we added them to the class.
            
    except Exception as e:
        print(f"CRASH: {e}")

if __name__ == "__main__":
    debug_parsing()
