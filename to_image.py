from pdf2image import convert_from_path

images = convert_from_path('./assets/aws.pdf')

for i in range(len(images)):
    images[i].save('assets/page'+ str(i) +'.jpg', 'JPEG')