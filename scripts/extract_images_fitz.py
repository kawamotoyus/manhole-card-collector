import fitz
import os

pdf_path = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/dist/official/ManholeCard.pdf"
output_dir = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/public/images/extracted"
os.makedirs(output_dir, exist_ok=True)

try:
    doc = fitz.open(pdf_path)
    count = 0
    for page_index in range(len(doc)):
        page = doc[page_index]
        image_list = page.get_images()
        print(f"Page {page_index} has {len(image_list)} images.")
        
        for image_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Simple heuristic: ignore very small images (like icons or logos)
            if len(image_bytes) > 5000:
                image_filename = f"card_{count}.{image_ext}"
                with open(os.path.join(output_dir, image_filename), "wb") as f:
                    f.write(image_bytes)
                count += 1
    print(f"Successfully saved {count} sizable images.")
except Exception as e:
    print(f"An error occurred: {e}")
