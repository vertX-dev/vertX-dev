import os
from icrawler.builtin import GoogleImageCrawler

def download_and_rename(material, max_images=5):
    # Create a folder for this material inside "materials"
    safe_material = material.strip().replace(" ", "_")
    material_folder = os.path.join("materials", safe_material)
    os.makedirs(material_folder, exist_ok=True)

    # Construct the query (e.g., "wood texture")
    query = f"{material} texture"
    print(f"Downloading images for query: '{query}'...")

    # Initialize and run the crawler
    crawler = GoogleImageCrawler(storage={"root_dir": material_folder})
    crawler.crawl(keyword=query, max_num=max_images)

    # Rename downloaded images in the folder
    for count, filename in enumerate(os.listdir(material_folder), start=1):
        # Get the file extension
        ext = os.path.splitext(filename)[1]
        new_name = f"{safe_material}_texture_{count}{ext}"
        os.rename(os.path.join(material_folder, filename),
                  os.path.join(material_folder, new_name))
    print(f"Downloaded and renamed images for '{material}' in folder '{material_folder}'.")

def main():
    # Create a main folder if it doesn't exist
    os.makedirs("materials", exist_ok=True)

    # Prompt user for a comma-separated list of materials
    materials_input = input("Enter materials (comma-separated): ")
    materials_list = [m.strip() for m in materials_input.split(",") if m.strip()]

    # Loop through each material and process downloads
    for material in materials_list:
        download_and_rename(material, max_images=5)

if __name__ == "__main__":
    main()