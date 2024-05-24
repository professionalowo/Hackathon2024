import pdfplumber

# Function to convert a table to markdown, handling None values
def table_to_markdown(table):
    markdown = []
    # Extracting headers
    headers = table[0]
    header_row = '| ' + ' | '.join([str(header) if header is not None else '' for header in headers]) + ' |'
    markdown.append(header_row)

    # Adding separator for headers
    separator_row = '| ' + ' | '.join(['---'] * len(headers)) + ' |'
    markdown.append(separator_row)

    # Extracting rows
    for row in table[1:]:
        markdown_row = '| ' + ' | '.join([str(cell) if cell is not None else '' for cell in row]) + ' |'
        markdown.append(markdown_row)

    return '\n'.join(markdown)

# Extract tables and text from each page of the PDF and convert tables to markdown
pdf_path = 'ARCL_RG.pdf'
content = []

with pdfplumber.open(pdf_path) as pdf:
    for page_num in range(min(70, len(pdf.pages))):  # Only up to page 70
        page = pdf.pages[page_num]
        tables = page.extract_tables()
        if tables:
            for table in tables:
                markdown_table = table_to_markdown(table)
                content.append(markdown_table)
        else:
            text = page.extract_text()
            content.append(text)

# Join all content into one string
content_str = '\n\n'.join(content)

# Write the content to a file
with open('pdf_to_txt.txt', 'w') as f:
    f.write(content_str)