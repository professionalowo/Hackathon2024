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


# Extract tables from each page of the PDF and convert to markdown
pdf_path = 'ARCL_RG.pdf'
markdown_tables = []

with pdfplumber.open(pdf_path) as pdf:
    for page_num in range(len(pdf.pages)):
        page = pdf.pages[page_num]
        tables = page.extract_tables()
        for table in tables:
            markdown_table = table_to_markdown(table)
            markdown_tables.append(markdown_table)

# Join all markdown tables into one string
markdown_content = '\n\n'.join(markdown_tables)
print(markdown_content )
