import pdfplumber
import sys

pdf_path = "/workspaces/AGLabo/Product/manhole-card-app/manhole-card-collector/v2/dist/official/ManholeCard.pdf"

print(f"Opening {pdf_path}")
try:
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        for i in range(min(5, len(pdf.pages))): # Inspect up to 5 pages
            page = pdf.pages[i]
            print(f"--- Page {i+1} Text ---")
            print(page.extract_text())
            print(f"--- Page {i+1} Images ---")
            print(f"Number of images: {len(page.images)}")
except Exception as e:
    print(f"Error reading PDF: {e}")
    sys.exit(1)
