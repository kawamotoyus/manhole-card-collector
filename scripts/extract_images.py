import pdfplumber
import os

pdf_path = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/dist/official/ManholeCard.pdf"
output_dir = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/public/images/extracted"
os.makedirs(output_dir, exist_ok=True)

print("Starting image extraction...")
with pdfplumber.open(pdf_path) as pdf:
    # Just extract first 10 images from first page to test
    page = pdf.pages[0]
    for i, img in enumerate(page.images[:10]):
        try:
            # We need to get the image blob. pdfplumber returns image coordinates, not easy to save directly. 
            # We should probably use pypdf for extraction.
            pass
        except Exception as e:
            pass

print("Using pypdf for image extraction...")
from pypdf import PdfReader
reader = PdfReader(pdf_path)
page = reader.pages[0]
count = 0
for image_file_object in page.images:
    with open(os.path.join(output_dir, str(count) + image_file_object.name), "wb") as fp:
        fp.write(image_file_object.data)
    count += 1
    if count >= 10:
        break
print(f"Saved {count} testing images.")
