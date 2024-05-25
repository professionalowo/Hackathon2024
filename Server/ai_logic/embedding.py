import os
from scipy.spatial.distance import cosine
import pickle
from openai import OpenAI
from transformers import AutoModel
from scipy import spatial
from numpy.linalg import norm
import json

model = AutoModel.from_pretrained('jinaai/jina-embeddings-v2-base-en',
                                  trust_remote_code=True)  # trust_remote_code is needed to use the encode method


# client = OpenAI(api_key='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')


def get_embedding(text):
    text = text.replace("\n", " ")
    # text = text.replace("\n", " ")
    # return client.embeddings.create(input=[text], model=model).data[0].embedding
    return model.encode(text)


# Folder with text documents
docs_folder = 'OtherChapters'

# Folder to save embeddings
embeddings_folder = 'OtherChapters_embeddings'
#
#
# # Create embeddings for all documents
# for filename in os.listdir(docs_folder):
#     with open(os.path.join(docs_folder, filename), 'r', encoding='utf-8') as f:
#         print(f'STARTED: {filename}')
#         text = f.read()
#
#     emb = get_embedding(text)
#
#     with open(os.path.join(embeddings_folder, filename.replace('.txt', '.pkl')), 'wb') as f:
#         print(f'Completed {filename}')
#         pickle.dump(emb, f)


# Semantic search function
def search(query, top_n=3):
    query_emb = get_embedding(query)

    docs = []
    scores = []
    for filename in os.listdir(embeddings_folder):
        embed_path = os.path.join(embeddings_folder, filename)
        with open(embed_path, 'rb') as f:
            doc_emb = pickle.load(f)

        print(query_emb)
        docs.append(filename)
        # scores.append(score)

    top_docs = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)[:top_n]

    print("Top Documents :")
    for doc, score in top_docs:
        print(doc, f"(Score: {score:.4f})")
    return top_docs


def query_function(query, return_val=2, get_data=False):
    file_list = os.listdir('embeddings')
    query_embedding = get_embedding(query)

    files = []
    similarities = []

    for file in file_list:
        with open(f'embeddings/{file}', 'rb') as f:
            doc_embedding = pickle.load(f)

        similarity = 1 - spatial.distance.cosine(query_embedding, doc_embedding)

        files.append(file)
        similarities.append(similarity)

    top_matches = sorted(zip(files, similarities), key=lambda x: x[1], reverse=True)[:return_val]

    match_file_list = [f[0] for f in top_matches]
    file_content = 'Related ARCL Commands / explanations to the users question found in system files:'
    resource_list = []
    if get_data:
        for file in match_file_list:
            # if file title consists of 'Title' then it pkl should be replaced with txt
            if 'Title_' in file:
                file = file.replace('.pkl', '.txt')
                with open(f"OtherChapters/{file}", 'r', encoding='utf-8') as f:
                    doc_text = f.read()
                    content = doc_text
                    resource_list.append(file.replace('.txt', '').replace('Title_', ''))
            else:
                file = file.replace(".pkl", ".json")
                with open(f"Commands/{file}", 'r') as f:
                    data = json.load(f)
                    content = "Title: " + data['title'] + ", " \
                              + "Syntax: " + data['syntax'] + ", " \
                              + "Usage Considerations: " + data['usage_considerations'].replace('\n', ' ') + ", " \
                              + "Parameters: " + data['parameters'].replace('\n', ' - ') + ", " \
                              + "Responses: " + data['responses'].replace('\n', ' ') + ", " \
                              + "Details: " + data['details'].replace('\n', ' ') + ", " \
                              + "Examples: " + data['examples'].replace('\n', ' ') + ", " \
                              + "Related Commands: " + data['related_commands'].replace('\n', ' ') + ", " \
                              + "Source: " + data['source'].replace('\n', ' ')
                    resource_list.append(data['page'].replace('\n', ' '))
                # pages need to be stored into a list as string and finally returned along with the files

                          # + "Page: " + data['page'].replace('\n', ' ')
            file_content = file_content + content + '---'
            # print('Related data found in:  ', file, content, file_content)
        return file_content, resource_list

    return [f[0] for f in top_matches]

# while True:
#     query = input('Enter your query: ')
#     response = query_function(query, get_data=True)
#     # place next line (use \n) response after every 100 charecters for better readability
#     response, resource_list = response
#     print(response)


# you can ask any question about flet and get back the details
# print(query_function("Failed going to goal", get_data=True))
