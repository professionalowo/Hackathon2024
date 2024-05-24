import json
import pickle
from scipy import spatial
from transformers import AutoModel

model = AutoModel.from_pretrained('jinaai/jina-embeddings-v2-base-en',
                                  trust_remote_code=True)  # trust_remote_code is needed to use the encode method


def get_embedding(text):
    text = text.replace("\n", " ")
    return model.encode(text)


# Load the JSON dictionary
with open('pdf_content.json', 'r') as f:
    pages_dict = json.load(f)


# Create embeddings for all pages and store them in a dictionary
# embeddings_dict = {}
# for page, content in pages_dict.items():
#     emb = get_embedding(content)
#     print(f"Embedding for {page} created successfully.")
#     embeddings_dict[page] = emb
#
# # Save the embeddings dictionary to a file
# with open('embeddings_dict.pkl', 'wb') as f:
#     pickle.dump(embeddings_dict, f)

def search(query, top_n=8):
    query_emb = get_embedding(query)

    # Load the embeddings dictionary
    with open('embeddings_dict.pkl', 'rb') as f:
        embeddings_dict = pickle.load(f)

    pages = []
    similarities = []

    for page, emb in embeddings_dict.items():
        similarity = 1 - spatial.distance.cosine(query_emb, emb)
        pages.append(page)
        similarities.append(similarity)

    top_pages = sorted(zip(pages, similarities), key=lambda x: x[1], reverse=True)[:top_n]

    print("Top Pages :")
    for page, similarity in top_pages:
        print(page, f"(Similarity: {similarity:.4f})")

    return top_pages


# Example usage


# you can ask any question about flet and get back the details
# print(query_function("How secure is flet, and what are options for authorisation?"))



def print_page_content(page):
    # Load the JSON dictionary
    with open('pdf_content.json', 'r') as f:
        pages_dict = json.load(f)

    # Check if the page exists in the dictionary
    if page in pages_dict:
        print(f"Contents of {page}:")
        print(pages_dict[page])
    else:
        print(f"{page} does not exist in the dictionary.")


# Example usage
page = search("Failed going to goal")
print(page)
# print_page_content("Page 24")