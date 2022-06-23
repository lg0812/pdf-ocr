from paddleocr import PaddleOCR

ocr = PaddleOCR(use_angle_cls=True, lang='ch') 
img_path = './assets/demo.png'
result = ocr.ocr(img_path, cls=True)

for line in result:
    print(line)
