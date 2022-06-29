import axios from "axios";
import fs from 'fs'

const str = fs.readFileSync('aws.txt', 'utf8')
/**
 * 生成 quesion
 * @type {number}
 */
let t = 1
const generate = (list) => {
    let q = {
        No: 0,
        description: '',
        options: [],
        answers: '',
        isMulti: false,
        explanation: ''
    }
    if (list.length > 0) {
        // 获取题目编号
        const matches = list[0].match(/^Q(\d+)/)
        q.No = matches[1]

        console.log("q.No, current index:", q.No, t)
        if (q.No != t) {
            throw new Error('题目编号错误')
        }

        // 获取 question 正文
        let content = "", i = 0;
        while (!/^[A-Ea-e](?![a-zA-Z])/.test(list[i]) && i < list.length) {
            content += list[i]
            i++;
        }
        // 替换掉 问题编号
        q.description = content.replace(/^Q\d+[\.]?/, '')

        while (!/^答案/.test(list[i]) && i < list.length) {
            const symbolMatches = list[i].match(/^[A-Ea-e]/)
            console.log("======options======")

            let option = list[i].replace(/^[A-Ea-e]\./, '')
            i++

            // 处理多行 答案 情况
            while (!/^[A-Ea-e](?![a-zA-Z])/.test(list[i]) && !/^答案/.test(list[i]) && i < list.length) {
                option += list[i]
                i++
            }

            q.options.push({
                symbol: symbolMatches[0],
                description: option.replace(/^[A-Ea-e][\.]?/, '')
            })
        }

        // 处理答案
        if (/^答案/.test(list[i])) {
            const answerMatches = list[i].match(/([A-Ea-e]+)/)
            console.log("======answers======", list[i])
            const answers = answerMatches[1].split('')
            q.answers = answers.join(',')
            q.isMulti = answers.length > 1
            i++
        }

        if (q.answers.length < 1) {
            console.log("check answers: q.No, current index:", q.No, t)
            throw new Error('no answers')
        }
        // 检查答案数量
        else if (q.answers.length == 1) {
            // 检查选项数量
            if (q.options.length != 4) {
                console.log("check options: q.No, current index:", q.No, t)
                throw new Error('选项数量小于4')
            }
        }
        // 检查答案数量
        else if (q.answers.length == 2) {
            // 检查选项数量
            if (q.options.length < 5) {
                console.log("check options: q.No, current index:", q.No, t)
                throw new Error('选项数量小于5')
            }
        }

        while (i < list.length) {
            q.explanation += list[i]
            i++
        }
        console.log("======explanation======")
    } else {
        console.error('无效的 question')
    }

    console.log(q)
    t++
    return q;
}


const strs = str.split(/\n/)
const questions = []
let question = []
for (const str of strs) {
    if (/^Q\d+/.test(str)) {
        if (question.length > 0) {
            questions.push(generate(question.filter(item => item != '')))
        }

        question = []
    }
    question.push(str)
}

// 处理最后一题
if (question.length > 0) {
    questions.push(generate(question.filter(item => item != '')))
}

axios('http://localhost:8081/api/exam', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    data: {
        name: "SAA C01真题 第二套",
        description: "2022/06/25 create by ocr",
        questions
    }
})