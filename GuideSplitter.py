import fitz
import pymupdf
import json
import os
import re
import io
from PIL import Image


# not used rn, could be usefull later
def findtables(doc):
    for page_number in range(len(doc)):  # Loop through each page
        page = doc[page_number]  # get the 1st page of the document
        tabs = page.find_tables()  # locate and extract any tables on page
        if len(tabs.tables) != 0:
            print(f"{len(tabs.tables)} found on {page}")  # display number of found tables


# prints out the whole page not just the image
def picture_extraction(doc):
    pages = []
    picture_info = []
    for page_number in range(len(doc)):
        pictures = doc.get_page_images(page_number)
        page = doc.load_page(page_number)
        if len(pictures) != 0:
            pages.append(page)
            picture_info.append(pictures)
    for page in pages:  # iterate through the pages
        pix = page.get_pixmap()  # render page to an image
        script_directory = os.path.dirname(os.path.realpath(__file__))
        pictures_folder = os.path.join(script_directory, "Pictures")
        pix.save(os.path.join(pictures_folder, f"page-{page.number}.png"))


# This function is specific to the pdf
def find_command_reference_section(doc):
    chapters = doc.get_toc()
    # Find the index of the chapter 'ARCL Command Reference'
    start_index = None
    for i, chapter in enumerate(chapters):
        if chapter[1] == 'ARCL Command Reference' and chapter[0] == 1:
            start_index = i
            break

    # Find the index of the chapter 'ARCL Server Messages' or end of the TOC
    end_index = None
    for i, chapter in enumerate(chapters[start_index:], start=start_index):
        if chapter[1] == 'ARCL Server Messages' and chapter[0] == 1:
            end_index = i
            break

    filtered_chapters = [chapter for chapter in chapters[start_index:end_index + 1] if chapter[0] == 2]
    filtered_chapters.append(chapters[end_index])
    return filtered_chapters

def extract_chapter_text_last(doc,chapter):
    last_chapter = doc.get_toc()[-1]
    return extract_chapter_text(doc,chapter, last_chapter)
def extract_chapter_text(doc, chapter, nextchapter):
    start_page = chapter[2]  # Adjust page number to 0-based index
    end_page = nextchapter[2]  # End page (inclusive)
    chapter_text = ""

    for page_number in range(start_page, end_page):
        page = doc.load_page(page_number - 1)  # Load the page with index
        chapter_text += page.get_text()

    # print(chapter_text)
    # # Find the indices of start of the chapter and the end
    # start_index = chapter_text.find(chapter[1])
    # end_index = chapter_text.find(nextchapter[1])
    #
    # # Trim the text
    # if start_index != -1 and end_index != -1:
    #     chapter_text = chapter_text[start_index + len(chapter[1]):end_index]

    return chapter_text.strip()  # Trim leading and trailing whitespaces


# This function is specific to the pdf
def create_json_from_chapter_text(chapter_text, chapter_title):
    json_data = {
        "title": "",
        "syntax": "",
        "usage_considerations": "",
        "parameters": "",
        "responses": "",
        "details": "",
        "examples": "",
        "related_commands": "",
        "source": "",
        "page": ""
    }

    # Find the index of each parameter
    parameters = [
        "\nSyntax", "\nUsage Considerations",
        "\nParameters", "\nResponses", "\nDetails",
        "\nExamples", "\nRelated Commands"
    ]
    parameter_indices = [chapter_text.find(param) for param in parameters]

    # Extract information for each parameter
    for i in range(len(parameters) - 1):
        start_index = parameter_indices[i]
        end_index = parameter_indices[i + 1]

        if start_index != -1 and end_index != -1:
            parameter_info = chapter_text[start_index + len(parameters[i]):end_index].strip()
            parameter_key = parameters[i].lower().replace(" ", "_").replace("\n", "")
            json_data[parameter_key] = parameter_info

    # Set the chapter title
    json_data["title"] = chapter_title.strip()

    # Special handling for the "Related Commands" section
    related_commands_start_index = parameter_indices[-1]
    last_index = chapter_text.rfind("\n", related_commands_start_index, len(chapter_text))
    related_commands_end_index = chapter_text.rfind("\n", related_commands_start_index, last_index)

    if related_commands_start_index != -1 and related_commands_end_index != -1:
        related_commands_info = chapter_text[
                                related_commands_start_index + len(parameters[-1]):related_commands_end_index].strip()
        json_data["related_commands"] = related_commands_info
    json_data["source"] = chapter_text[related_commands_end_index:last_index]
    json_data["page"] = chapter_text[last_index:len(chapter_text)]

    return json_data


def extract_command_to_json(doc):
    important_chapters = find_command_reference_section(doc)
    for i in range(1, len(important_chapters) - 1):
        chapter_text = extract_chapter_text(doc, important_chapters[i], important_chapters[i + 1])
        json_data = create_json_from_chapter_text(chapter_text, important_chapters[i][1])
        file_title = re.sub(r'[<>:"/\\|?*]', '_', json_data["title"])
        file_path = os.path.dirname(
            __file__) + "\\Commands\\" + file_title + ".json"  # Get the directory of the currently executing script

        with open(file_path, "w") as json_file:
            json.dump(json_data, json_file, indent=4)


def extract_chapter_information(doc):
    toc_chapters = doc.get_toc()
    command_reference_chapters = find_command_reference_section(doc)
    # Filter out the chapters in command_reference_chapters from toc_chapters
    other_chapters = [x for x in toc_chapters if x not in command_reference_chapters if x[0] != 3]
    #append the last chapter from the cutaway
    other_chapters.append(command_reference_chapters[-1])

    for i in range(0, len(other_chapters)):
        if i < len(other_chapters) - 1:
            chapter_text = extract_chapter_text(doc, other_chapters[i], other_chapters[i + 1])
        else:
            chapter_text = extract_chapter_text_last(doc, other_chapters[i])
        file_title = re.sub(r'[<>:"/\\|?*]', '_', f'Title_{other_chapters[i][1]} Level_{other_chapters[i][0]}.txt')
        chapter_filename = os.path.join('OtherChapters',file_title )
        # Save the chapter text to the file
        with open(chapter_filename, 'w', encoding='utf-8') as file:
            file.write(chapter_text)


if __name__ == "__main__":
    try:
        doc = pymupdf.open("ARCL_RG.pdf")  # open a document
        # extract_command_to_json(doc)
        extract_chapter_information(doc)
        doc.close()
    except FileNotFoundError:
        print("File not found. Please check the file path and try again.")