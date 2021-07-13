from flask import Flask, request, jsonify, url_for, render_template
from flask_cors import CORS, cross_origin
import pandas as pd
import spacy


def processing(doc):
    nlp = spacy.load('en_core_web_sm')
    stopwords = spacy.lang.en.stop_words.STOP_WORDS

    p_doc = nlp(doc)

    keywords = []

    custom_stopwords = ['image']
    for token in p_doc:
        if token.lemma_ not in keywords:
            if not token.is_stop and token.pos != 'Pronoun' and token.pos != 'Preposition' and token.pos != 'Conjunction' and token.pos != 'Interjection':
                if token.lemma_ not in custom_stopwords:
                    keywords.append(token.lemma_)

    df = pd.read_csv(
        r"C:\Users\adamj\OneDrive\Desktop\ProgrammingStuff\python\captionit-keys\quotes.csv")
    df.dropna(inplace=True)

    category = df['category']
    quote = df['quote']
    author = df['author']

    def search(keywords):
        global found_keywords
        found_keywords = {}
        global inot
        inot = []
        for i in range(1, len(keywords)+1):
            found_keywords[i] = []
        for i in range(0, 497898):
            c = 0
            for j in keywords:
                try:
                    for k in list(str(category[i]).split(', ')):
                        if j == k:
                            c += 1
                            break
                except:
                    inot.append(i)
            """if c == 3:
                print(c)"""
            if c != 0:
                found_keywords[c].append(i)

    search(keywords)

    quote_send_dic = {}
    c = 0

    for i in range(0, len(keywords)):
        for j in range(0, 10):
            try:
                quote_send_dic[str(author[found_keywords[len(keywords)-i][j]])
                               ] = str(quote[found_keywords[len(keywords)-i][j]])
                c += 1
            except:
                pass
    # quote_send_dic = quote_send_dic[:10]
    return quote_send_dic


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# @app.route("/")

# def display():
#    return render_template()

@app.route("/")  # , methods=['GET', 'POST'])
@cross_origin()
def show():
    doc = request.args.get("text")
    dic = processing(doc)
    return jsonify(dic)


if __name__ == '__main__':
    app.run(debug=True)
