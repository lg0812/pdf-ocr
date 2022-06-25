from paddleocr import PaddleOCR

ocr = PaddleOCR(use_angle_cls=True, lang='ch')

with open('aws.txt', mode='w') as filename:
    for i in range(195):
        print("page: ", i)
        img_path = './assets/page' + str(i) + '.jpg'
        result = ocr.ocr(img_path, cls=True)

        for line in result:
            print(line[1][0])
            filename.write(line[1][0])
            filename.write('\n')
