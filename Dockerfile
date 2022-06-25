From python:3.8 

RUN python --version

RUN python -m pip install paddlepaddle==2.3.0 -i https://mirror.baidu.com/pypi/simple
RUN pip install protobuf==3.20.1 -i https://mirror.baidu.com/pypi/simple
RUN pip install "paddleocr>=2.0.1" -i https://mirror.baidu.com/pypi/simple
RUN apt update
RUN apt install -y libgl1-mesa-glx
