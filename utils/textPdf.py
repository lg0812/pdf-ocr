import pdfplumber

with open('../assets/Amazon.SAA-C02.v2021-12-13.q133.text', 'a') as output:
    with pdfplumber.open("../assets/Amazon.SAA-C02.v2021-12-13.q133.pdf") as pdf:
        for i in range(len(pdf.pages)):
            first_page = pdf.pages[i]
            output.write(first_page.extract_text())
