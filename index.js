import axios from "axios";
import fs from 'fs'
import {trimStart} from "lodash-es";

const config = {
    NoPrefix: '^Q(\\d+)[.。：:]?',
    OptionPrefix: '^([A-Ea-e])(?![a-zA-Z])[.]?',
    AnswerPrefix: '^答案[:]?'
}

const hubConfig = {
    NoPrefix: '^QUESTION (\\d+)[.。：:]?',
    OptionPrefix: '^([A-Ea-e])(?![a-zA-Z])[.]',
    AnswerPrefix: '^Answer[:]?'
}

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
        const matches = trimStart(list[0]).match(new RegExp(config.NoPrefix))
        q.No = matches[1]

        console.log("q.No, current index:", q.No, t)
        if (q.No != t) {
            throw new Error('题目编号错误')
        }

        // 获取 question 正文
        let content = "", i = 0;
        while (!new RegExp(config.OptionPrefix).test(list[i]) && i < list.length) {
            content += list[i]
            i++;
        }

        // 替换掉 问题编号
        q.description = content.replace(new RegExp(config.NoPrefix), '')

        while (!new RegExp(config.AnswerPrefix).test(list[i]) && i < list.length) {
            const symbolMatches = list[i].match(new RegExp(config.OptionPrefix))

            let option = list[i].replace(new RegExp(config.OptionPrefix), '')
            i++

            // 处理多行 答案 情况
            while (!new RegExp(config.OptionPrefix).test(list[i]) && !new RegExp(config.AnswerPrefix).test(list[i]) && i < list.length) {
                option += list[i]
                i++
            }

            q.options.push({
                symbol: symbolMatches[1],
                description: option.replace(new RegExp(config.OptionPrefix), '')
            })
        }

        // 处理答案
        if (new RegExp(config.AnswerPrefix).test(list[i])) {
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
            if (q.options.length < 4) {
                console.log("check options: q.No, current index:", q.No, t, q)
                throw new Error('选项数量小于4')
            }
        }
        // 检查答案数量
        else if (q.answers.length == 2) {
            // 检查选项数量
            if (q.options.length < 5) {
                console.log("check options: q.No, current index:", q.No, t, q)
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
    if (new RegExp(config.NoPrefix).test(str)) {
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

axios('http://8.210.53.132:8081/api/exam', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    data: {
        name: "SAA C01真题 第三套",
        description: "2022/06/25 create by ocr",
        questions
    }
})