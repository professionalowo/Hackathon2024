import os
from scipy.spatial.distance import cosine
import pickle
from openai import OpenAI
from transformers import AutoModel
from scipy import spatial
from numpy.linalg import norm

model = AutoModel.from_pretrained('jinaai/jina-embeddings-v2-base-en',
                                  trust_remote_code=True)  # trust_remote_code is needed to use the encode method


# client = OpenAI(api_key='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')


def get_embedding(text):
    text = text.replace("\n", " ")
    # text = text.replace("\n", " ")
    # return client.embeddings.create(input=[text], model=model).data[0].embedding
    return model.encode(text)


# Folder with text documents
docs_folder = 'flet_gpt'

# Folder to save embeddings
embeddings_folder = 'embeddings'

# Create embeddings for all documents
# for filename in os.listdir(docs_folder):
#     with open(os.path.join(docs_folder, filename), 'r') as f:
#         text = f.read()
#
#     emb = get_embedding(text)
#
#     with open(os.path.join(embeddings_folder, filename.replace('.txt', '.pkl')), 'wb') as f:
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


def query_function(query, return_val=4, get_data=False):
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

    if get_data:
        f = top_matches[0]
        file = f[0].replace(".pkl", ".txt")
        print('Related data found in:  ', file)
        with open(f"flet_gpt/{file}", 'r') as f:
            doc_text = f.read()
        return doc_text

    return [f[0] for f in top_matches]


# you can ask any question about flet and get back the details
print(query_function("How secure is flet, and what are options for authorisation?"))
