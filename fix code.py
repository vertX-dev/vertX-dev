import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext

def add_spaces_to_code(code, num_spaces):
    """Prepend a given number of spaces to each line in the code."""
    spaces = " " * num_spaces
    spaced_lines = [spaces + line for line in code.splitlines()]
    return "\n".join(spaced_lines)

def open_file():
    file_path = filedialog.askopenfilename(
        title="Open Code File",
        filetypes=(("All Files", "*.*"), ("Text Files", "*.txt"), ("HTML Files", "*.html"))
    )
    if file_path:
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                code = file.read()
            input_text.delete(1.0, tk.END)
            input_text.insert(tk.END, code)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to open file:\n{e}")

def save_file():
    file_path = filedialog.asksaveasfilename(
        title="Save Modified Code",
        defaultextension=".txt",
        filetypes=(("Text Files", "*.txt"), ("HTML Files", "*.html"), ("All Files", "*.*"))
    )
    if file_path:
        try:
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(output_text.get(1.0, tk.END))
            messagebox.showinfo("Success", f"File saved to:\n{file_path}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save file:\n{e}")

def process_code():
    try:
        num_spaces = int(space_entry.get())
    except ValueError:
        messagebox.showerror("Input Error", "Please enter a valid number for spaces.")
        return

    original_code = input_text.get(1.0, tk.END)
    modified_code = add_spaces_to_code(original_code, num_spaces)
    output_text.delete(1.0, tk.END)
    output_text.insert(tk.END, modified_code)

# Create the main window
root = tk.Tk()
root.title("Add Spaces to Code")

# Create frames for better organization
frame_top = tk.Frame(root)
frame_top.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

frame_bottom = tk.Frame(root)
frame_bottom.pack(padx=10, pady=10, fill=tk.X)

# Add a scrolled text widget to display the input file content
input_label = tk.Label(frame_top, text="Original Code:")
input_label.pack(anchor="w")

input_text = scrolledtext.ScrolledText(frame_top, wrap=tk.WORD, width=80, height=15)
input_text.pack(fill=tk.BOTH, expand=True)

# Buttons for opening file and processing
btn_frame = tk.Frame(frame_top)
btn_frame.pack(fill=tk.X, pady=5)

open_btn = tk.Button(btn_frame, text="Open File", command=open_file)
open_btn.pack(side=tk.LEFT, padx=(0, 5))

process_btn = tk.Button(btn_frame, text="Add Spaces", command=process_code)
process_btn.pack(side=tk.LEFT, padx=(5, 5))

# Entry for number of spaces
space_label = tk.Label(frame_bottom, text="Number of spaces:")
space_label.pack(side=tk.LEFT)

space_entry = tk.Entry(frame_bottom, width=5)
space_entry.pack(side=tk.LEFT, padx=(0, 10))
space_entry.insert(0, "3")  # default value

# Add a scrolled text widget to display the output code
output_label = tk.Label(frame_bottom, text="Modified Code:")
output_label.pack(anchor="w", pady=(10, 0))

output_text = scrolledtext.ScrolledText(frame_bottom, wrap=tk.WORD, width=80, height=15)
output_text.pack(fill=tk.BOTH, expand=True, pady=(0,10))

# Save button
save_btn = tk.Button(frame_bottom, text="Save Modified Code", command=save_file)
save_btn.pack()

root.mainloop()