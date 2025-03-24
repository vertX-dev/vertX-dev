import os
from PIL import Image
import numpy as np
import argparse

radius = float(input("radius(0-1): "))

def process_image(input_path, output_path, radius):
    """
    Open an image, remove (make transparent) all pixels except for those that are within
    the specified color tolerance (radius) of the target colors, and save the result.

    Parameters:
      input_path (str): Path to the input image.
      output_path (str): Path where the processed image will be saved.
      radius (float): Tolerance (in normalized RGB [0,1] space) for color matching.
    """
    # Open the image and ensure it has an alpha channel
    im = Image.open(input_path).convert('RGBA')
    data = np.array(im)

    # Normalize the RGB channels to the range [0,1]
    rgb = data[..., :3].astype(np.float32) / 255.0

    # Define the target colors (converted from hex to normalized RGB)
    target_colors = np.array([
        [0xE0, 0x99, 0x3C],  # E0993C
        [0xFB, 0xBD, 0x5D],  # FBBD5D
        [0x7E, 0x4E, 0x26],  # 7E4E26
        [0x68, 0x4E, 0x1E],  # 684E1E
        [0x49, 0x36, 0x15],  # 493615
        [0x28, 0x1E, 0x0B],  # 281E0B
        [0x38, 0x2A, 0x10],  #382A10
        [0x89, 0x67, 0x27]   # 896727
    ]) / 255.0  # Normalize to [0,1] range

    # Compute the minimum Euclidean distance for each pixel to any target color
    min_diff = np.full(rgb.shape[:2], np.inf)  # Start with large values
    for color in target_colors:
        diff = np.linalg.norm(rgb - color, axis=2)
        min_diff = np.minimum(min_diff, diff)

    # Create a mask for pixels that are within the specified radius of any target color.
    mask = min_diff <= radius

    # For all pixels NOT in our mask, set the alpha channel to 0 (make them transparent)
    new_data = data.copy()
    new_data[..., 3] = np.where(mask, new_data[..., 3], 0)

    # Save the modified image
    new_im = Image.fromarray(new_data, 'RGBA')
    new_im.save(output_path)

def main():
    # Set up argument parsing for the color radius.
    parser = argparse.ArgumentParser(description="Process images to keep only specified colors.")
    parser.add_argument(
        "--radius",
        type=float,
        default=radius,
        help="Radius for color tolerance in normalized scale (0-1). Lower values keep fewer colors."
    )
    args = parser.parse_args()

    base_folder = "weapons/textures/base"        # Folder with the original images.
    overlay_folder = "weapons/textures/overlay"  # Folder where the processed images will be saved.
    os.makedirs(overlay_folder, exist_ok=True)
    
    # Process all files that match the pattern texture_<item type>.png
    for filename in os.listdir(base_folder):
        if filename.startswith("texture_") and filename.endswith(".png"):
            input_path = os.path.join(base_folder, filename)
            # Replace "texture_" with "overlay_" in the filename.
            new_filename = filename.replace("texture_", "overlay_")
            output_path = os.path.join(overlay_folder, new_filename)
            process_image(input_path, output_path, args.radius)
            print(f"Processed {filename} -> {new_filename} with radius {args.radius}")

if __name__ == "__main__":
    main()