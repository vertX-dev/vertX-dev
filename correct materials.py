import os
import shutil

# Define the path to the materials folder
materials_path = "materials"

# Iterate through all subdirectories in the materials folder
for folder_name in os.listdir(materials_path):
    folder_path = os.path.join(materials_path, folder_name)

    # Check if the current item is a directory
    if os.path.isdir(folder_path):
        # Iterate through files inside the subdirectory
        for file_name in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file_name)

            # Check if the file is an image (basic extension check)
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff')):
                # Construct the new file name
                new_name = f"color_{folder_name}_{file_name}"
                new_path = os.path.join(materials_path, new_name)

                # Move the image to the materials folder with the new name
                shutil.move(file_path, new_path)

        # Remove the now-empty subdirectory
        shutil.rmtree(folder_path)

print("Images extracted, folders deleted, and images renamed successfully.")