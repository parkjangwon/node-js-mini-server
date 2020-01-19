/*
  @author pjw vim@kakao.com
  @since 20200108

  Express를 사용한 간단한 REST API 서버입니다.
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.json());

let nextId = 4;

// 더미데이터
let datas = [
  {
    id: 1,
    name: 'aaa'
  },
  {
    id: 2,
    name: 'bbb'
  },
  {
    id: 3,
    name: 'ccc'
  }
];

// 전체 data 배열을 반환한다.
app.get('/', (req, res) => {
  setTimeout(() => {
    if (datas.length < 1) {
      return res.status(400).json({ error: 'No data' });
    }

    return res.status(201).send(datas);
  }, 1000);
});

// id에 따른 특정 data를 반환한다.
app.get('/:id', (req, res) => {
  const data = datas.find(d => d.id == req.params.id);

  if (!data) {
    return res.status(400).json({ error: 'No data' });
  }

  return res.status(201).send(data);
});

// 기존 data배열에 새로운 data를 추가한다.
app.post('/', (req, res) => {
  // ES6 syntax : Spread Operator
  //           { id: id         , name: name }
  const data = { id: getNextId(), ...req.body };

  // 기존 배열에 담긴 데이터 다음 인덱스에 데이터를 추가한다.
  datas = [...datas, data];

  return res.status(201).send(datas);
});

// data배열 전체 삭제
app.delete('/', (req, res) => {
  if (datas.length == 0) {
    return res.status(404).send({ error: 'not exist data' });
  }

  datas.splice(0, datas.length);
  return res.send(datas);
});

// id에 따른 특정 data 삭제
app.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const dataIndex = datas.findIndex(d => d.id == id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'plz input num' });
  } else if (datas[dataIndex]) {
    datas.splice(dataIndex, 1);

    return res.status(201).send(datas);
  } else {
    return res.status(404).json({ error: 'not exist data' });
  }
});

// id에 따른 특정 data 수정
app.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const dataIndex = datas.findIndex(f => f.id == id);

  if (dataIndex > -1) {
    const todo = { ...datas[dataIndex], ...req.body };

    datas = [...datas.slice(0, dataIndex), todo, ...datas.slice(dataIndex + 1)];
    return res.status(201).send(datas);
  } else {
    return res.status(404).json({ error: 'not exist data' });
  }
});

app.listen(port, () =>
  console.log(`Simple REST API server listening on port ${port}!`)
);

// 데이터 추가 시 id값 증가를 위한 함수
function getNextId() {
  return nextId++;
}
