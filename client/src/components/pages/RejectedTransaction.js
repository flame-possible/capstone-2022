import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../common/PageTitle";
import Pagination from "../pagination.js";
import moment from "moment";

import {
  ListGroup,
  ListGroupItem,
  FormTextarea,
  Form,
  FormInput,
  FormGroup,
  FormCheckbox,
  FormSelect,
  Button
} from "shards-react";

import axios from 'axios';

function RejectedTransaction({transactionInstance, account}){
  
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [block_list, setblock_list] = useState([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(false);
  const [comment, setComment] = useState("");

  const [detail, setDetail] = useState(false);
  const [detailcnt, setDetailcnt] = useState(-1);
  const [reject, setReject] = useState(false);

  const detail_click = (cnt) => {
    setDetail(true);
    setDetailcnt(cnt);
    if (block_list[cnt].request_user_check == 1 && block_list[cnt].receive_user_check == 1){
      
      axios.post('http://localhost:3001/api/request_check_alarm', null, {
        
        params: {
          'time_stamp': block_list[cnt].time_stamp
          }
      })
      .then(async res => {
        console.log(res)    

      })
      .catch()
    }
  }

  const rejectOrNot = (e) => {
    setReject(true);
    console.log(reject);
  };
  

  // send 전자문서 블록체인
  const sendTransaction = async (e) => {

    await transactionInstance.sendTrans(block_list[detailcnt].category, block_list[detailcnt].name, block_list[detailcnt].ipfsHash, block_list[detailcnt].registrant, block_list[detailcnt].responsible, block_list[detailcnt].file_type, block_list[detailcnt].file_des,{
      from: account,
      //value: e.web3.utils.toWei('10', "ether"),
      gas: 1000000
    })
    
    axios.post('http://localhost:3001/api/success_request', null, {
      
      params: {
        'time_stamp': block_list[detailcnt].time_stamp
        }
    })
    .then(async res => {
      console.log(res)    

    })
    .catch()
    
    let events = await transactionInstance.getPastEvents('handleTransaction', {fromBlock: 0, toBlock:'latest'});
    console.log(events[events.length-1].transactionHash)
    //this.updateAllTransactions();
    window.location.replace("/")
    // submitReview();
  }
  
  // send 체크리스트 블록체인
  const sendChecklistTransaction = async (e) => {

    let des = [];

    des.push(block_list[detailcnt].des1);
    des.push(block_list[detailcnt].des2);
    des.push(block_list[detailcnt].des3);
    des.push(block_list[detailcnt].des4);
    des.push(block_list[detailcnt].des5);
    des.push(block_list[detailcnt].des6);
    des.push(block_list[detailcnt].des7);
    des.push(block_list[detailcnt].des8);
    des.push(block_list[detailcnt].des9);
    des.push(block_list[detailcnt].des10);

    await transactionInstance.sendCheckTrans(block_list[detailcnt].category, block_list[detailcnt].checktype, block_list[detailcnt].registrant, block_list[detailcnt].responsible, des, {
      from: account,
      //value: e.web3.utils.toWei('10', "ether"),
      gas: 1000000
    })
    
    axios.post('http://localhost:3001/api/success_request', null, {
      
      params: {
        'time_stamp': block_list[detailcnt].time_stamp
        }
    })
    .then(async res => {
      console.log(res)    

    })
    .catch()

    
    let events = await transactionInstance.getPastEvents('checkTransaction', {fromBlock: 0, toBlock:'latest'});
    console.log(events)
    //this.updateAllTransactions();
    window.location.replace("/")
    // submitReview();
  }

  
  // send 수정필요
  const fail_to_upload = async (e) => {

    
    axios.post('http://localhost:3001/api/fail_request', null, {
      
      params: {
        'comment': comment,
        'time_stamp': block_list[detailcnt].time_stamp
        }
    })
    .then(async res => {
      console.log(res)    

    })
    .catch()

    
    let events = await transactionInstance.getPastEvents('checkTransaction', {fromBlock: 0, toBlock:'latest'});
    console.log(events)
    //this.updateAllTransactions();
    window.location.replace("/")
    // submitReview();
  }

  function repeatboardchild(child, start){
    if(loading){

      let arr = [];

      if(start == 1) start = 0;
      else{
        start--;
        start *= 10;
      }
  
      let end = start + 10;
  
      if (end > child.length){
        end = child.length;
      }
  
      console.log('child = ', child);
      
      console.log('child.length = %d', child.length);
      for(let i = start; i < end; i++){
        console.log('i = %d, start = %d, end = %d', i, start, end);
        console.log(sessionStorage.getItem('search'));
        console.log(child[i].des1);
        // if(sessionStorage.getItem('search') === null){
          if (child[i].des1 == "0" || child[i].des1 == "1"){
            arr.push(
              <tr key={i} onClick={() => detail_click(i)} style={{cursor: "pointer"}}>
                <th scope="row" >{i+1}</th>
                <td >{child[i].checktype}</td>
                <td>{child[i].registrant}</td>
                <td>{child[i].file_type}</td>
                <td>{child[i].file_des}</td>
                <td>{child[i].time_stamp}</td>
                <td>{child[i].check}</td>
              </tr>
              )
          }
          else{
            arr.push(
              <tr key={i} onClick={() => detail_click(i)} style={{cursor: "pointer"}}>
                <th scope="row" >{i+1}</th>
                <td >{child[i].name}</td>
                <td>{child[i].registrant}</td>
                <td>{child[i].file_type}</td>
                <td>{child[i].file_des}</td>
                <td>{child[i].time_stamp}</td>
                <td>{child[i].check}</td>
              </tr>
              )
          }
        // }
        // else if(sessionStorage.getItem('search') === child[i].name || sessionStorage.getItem('search') === child[i].responsible || sessionStorage.getItem('search') === child[i].filetype || sessionStorage.getItem('search') === child[i].filedes){
        //   arr.push(
        //     <tr key={i} onClick={() => detail_click(i)} style={{cursor: "pointer"}}>
        //       <th scope="row" >{i+1}</th>
        //       <td >{child[i].name}</td>
        //       <td>{child[i].responsible}</td>
        //       <td>{child[i].filetype}</td>
        //       <td>{child[i].filedes}</td>
        //       <td>{child[i].time}</td>
        //     </tr>
        //     )
        // }
      }
  
      return arr;
    }

  }


  function Showboard(){

    console.log(first);
    console.log(detail);

    if(!detail && first){
      return (
        <div>
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Form</h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        #
                      </th>
                      <th scope="col" className="border-0">
                        File Name
                      </th>
                      <th scope="col" className="border-0">
                        Registrant
                      </th>
                      <th scope="col" className="border-0">
                        File Type
                      </th>
                      <th scope="col" className="border-0">
                        File Des
                      </th>
                      <th scope="col" className="border-0">
                        Upload Time
                      </th>
                      <th scope="col" className="border-0">
                        확인 여부
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {repeatboardchild(block_list, page)}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        
        <Pagination
              total={block_list.length}
              limit={limit}
              page={page}
              setPage={setPage}
            />
            </div>
      )
    }
    else if ((detail && first)){
      
      if(block_list[detailcnt].checktype == "Electricity"){

        return (
          
          <Row>
            <Col lg="7" md="12">
            <Card small>
            <CardHeader className="border-bottom">
              <h6 className="m-0">Form Example</h6>
            </CardHeader>
              <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                        <label htmlFor="feInputState" style={{color: 'red'}}>Comment</label>
                        <br></br>
                        <a style={{color: 'red'}}>{block_list[detailcnt].comment}</a>

                        <br></br>
                        <br></br>

                        <label htmlFor="feInputState">카테고리</label>
                        <br></br>
                        {block_list[detailcnt].category}

                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress">체크리스트 타입</label>
                        <br></br>
                        {block_list[detailcnt].checktype}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">1. 감전위험이 있는 전기 기계·기구 또는 전로의 설치·해체·정비·점검 등의 작업을 하는 하는 경우 작업자의 자격을 확인하였다.</label>
                        <br></br>
                      {block_list[detailcnt].des1 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">2. 감전의 위험이 있는 작업에 종사하는 경우 절연용 보호구를 지급하고 작업자에게 착용하도록 하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des2 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">3. 가공전로에 근접하여 비계를 설치하는 경우에는 가공전로를 이설하거나 가공전로에 절연용 방호구를 장착하는 등 가공전로와의 접촉을 방지하기 위해 조치 하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des3 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">4. 임시 수전설비의 주변은 관계 작업자가 아닌 사람의 출입을 금지하고, 위험표시 등의 방법으로 방호를 강화하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des4 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">5. 가설 배전반·분전반은 충전부가 노출되지 않도록 폐쇄형 외함이 있는 구조로 설치하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des5 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">6. 충전부는 충분한 절연효과가 있는 방호망이나 절연덮개를 설치하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des6 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">7. 분전반 등 전기 기계·기구의 금속제 외함, 금속제 외피 및 철대는 접지를 실시하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des7 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">8. 배선 또는 이동전선의 절연피복이 손상되거나 노화됨으로 인한 감전의 위험을 방지하기 위한 조치를 하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des8 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">9. 습윤한 장소의 이동전선 및 부속 접속기구는 충분한 절연효과가 있는 것을 사용하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des9 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">10. 통로바닥에 전선 또는 이동전선 등을 설치하여 사용하지 않도록 관리하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des10 ? "YES" : "NO"}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">업로더 이름</label>
                        <br></br>
                        {block_list[detailcnt].registrant}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">업로드 책임자</label>
                        <br></br>
                        {block_list[detailcnt].responsible}
                        <br></br>
                        <br></br>
  
                        
                      
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
            </Card>
            </Col>
          </Row>
        )
      }


      else if(block_list[detailcnt].checktype == "Welding"){

        return (
          
          <Row>
            <Col lg="7" md="12">
            <Card small>
            <CardHeader className="border-bottom">
              <h6 className="m-0">Form Example</h6>
            </CardHeader>
              <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                        <label htmlFor="feInputState" style={{color: 'red'}}>Comment</label>
                        <br></br>
                        <a style={{color: 'red'}}>{block_list[detailcnt].comment}</a>

                        <br></br>
                        <br></br>

                        <label htmlFor="feInputState">카테고리</label>
                        <br></br>
                        {block_list[detailcnt].category}

                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress">체크리스트 타입</label>
                        <br></br>
                        {block_list[detailcnt].checktype}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">1. 화재위험작업에 대한 작업계획을 수립하였다.</label>
                        <br></br>
                      {block_list[detailcnt].des1 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">2. 작업장 내 위험물, 가연물의 사용·보관 현황을 파악하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des2 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">3. 위험물질로 인한 응급상황이 발생했을 때 필요한 행동에 대한 정보를 미리 준비하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des3 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">4. 작업현장에 허가받은 위험물의 종류별 기준량 이상이 되면 지역 소방기관과 관계기관에 신고하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des4 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">5. 소방서로부터 허가받은 위험물 제조소 또는 저장소 자료를 토대로 현장에 위험물의 종류별로 기준 이상의 위험물이 존재하거나 앞으로 존재하게 될 것인지의 여부를 판단하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des5 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">6. 작업자에 대해 화재예방 및 피난 교육 등을 실시하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des6 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">7. 화재위험작업 대상 작업자에게 특별안전보건교육을 실시하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des7 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">8. 산소, LPG 등 가스 용기는 전도 위험이 없는 곳에 보관하며, 사용 전 또는 사용 중인 용기와 그 밖의 용기를 명확히 구별하여 보관하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des8 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">9. 작업을 중단하거나 마치고 작업장소를 떠날 경우에는 가스 등의 공급구의 밸브나 콕을 잠구었다.</label>
                      <br></br>
                      {block_list[detailcnt].des9 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">10. 인화성 가스 및 산소를 사용하여 금속을 용접·용단하는 경우, 지정된 자격증*의 보유 여부를 확인하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des10 ? "YES" : "NO"}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">업로더 이름</label>
                        <br></br>
                        {block_list[detailcnt].registrant}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">업로드 책임자</label>
                        <br></br>
                        {block_list[detailcnt].responsible}
                        <br></br>
                        <br></br>
                        
                      
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
            </Card>
            </Col>
          </Row>
        )
      }

      
      else if(block_list[detailcnt].checktype == "Construction"){

        return (
          
          <Row>
            <Col lg="7" md="12">
            <Card small>
            <CardHeader className="border-bottom">
              <h6 className="m-0">Form Example</h6>
            </CardHeader>
              <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                        <label htmlFor="feInputState" style={{color: 'red'}}>Comment</label>
                        <br></br>
                        <a style={{color: 'red'}}>{block_list[detailcnt].comment}</a>

                        <br></br>
                        <br></br>

                        <label htmlFor="feInputState">카테고리</label>
                        <br></br>
                        {block_list[detailcnt].category}

                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress">체크리스트 타입</label>
                        <br></br>
                        {block_list[detailcnt].checktype}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">1. 자격을 갖춘 자에게 운전을 하도록 하였다.</label>
                        <br></br>
                      {block_list[detailcnt].des1 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">2. 형식신고 및 안전인증·검사 등 기계별 필요한 검사를 받았는지 확인했다.</label>
                      <br></br>
                      {block_list[detailcnt].des2 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">3. 건설기계의 운행경로 및 작업방법을 고려해 기계별 작업계획을 수립·이행하고, 작업지휘자를 지정하여 지휘·감독했다.</label>
                      <br></br>
                      {block_list[detailcnt].des3 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">4. 작업 전 운전자 및 작업자 안전교육을 실시했다.</label>
                      <br></br>
                      {block_list[detailcnt].des4 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">5. 작업장소의 지형 및 지반상태를 확인하고, 기계가 넘어질 우려가 없도록 조치했다.</label>
                      <br></br>
                      {block_list[detailcnt].des5 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">6. 작업구간에 작업자의 출입을 금지하거나 유도자를 배치하여 차량을 유도하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des6 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">7. 유도자는 정해진 신호방법에 따라 차량을 유도했다.</label>
                      <br></br>
                      {block_list[detailcnt].des7 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">8. 건설기계는 주된 용도로만 사용하여야 했다.</label>
                      <br></br>
                      {block_list[detailcnt].des8 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">9. 승차석이 아닌 곳에 작업자를 탑승시키지 않았다.</label>
                      <br></br>
                      {block_list[detailcnt].des9 ? "YES" : "NO"}
                      
                      <br></br>
                      <br></br>
                      <label htmlFor="feInputAddress2">10. 지정된 제한속도를 준수하였다.</label>
                      <br></br>
                      {block_list[detailcnt].des10 ? "YES" : "NO"}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">업로더 이름</label>
                        <br></br>
                        {block_list[detailcnt].registrant}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">업로드 책임자</label>
                        <br></br>
                        {block_list[detailcnt].responsible}
                        <br></br>
                        <br></br>
  
                        
                      
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
            </Card>
            </Col>
          </Row>
        )
      }

      else{
      
        return (
        
          <Row>
            <Col lg="7" md="12">
            <Card small>
            <CardHeader className="border-bottom">
              <h6 className="m-0">Rejected Transaction</h6>
            </CardHeader>
              <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                        <label htmlFor="feInputState" style={{color: 'red'}}>Comment</label>
                        <br></br>
                        <a style={{color:'red'}}>{block_list[detailcnt].comment}</a>

                        <br></br>
                        <br></br>

                        <label htmlFor="feInputState">카테고리</label>
                        <br></br>
                        {block_list[detailcnt].category}
  
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress">파일명</label>
                        <br></br>
                        {block_list[detailcnt].name}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">파일 설명</label>
                        <br></br>
                        {block_list[detailcnt].file_des}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">업로더 이름</label>
                        <br></br>
                        {block_list[detailcnt].registrant}
                      
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">업로드 책임자</label>
                        <br></br>
                        {block_list[detailcnt].responsible}
                        
                        <br></br>
                        <br></br>
                        <label htmlFor="feInputAddress2">파일 URL</label>
                        <br></br>
                        FileUrl :{" "}
                        <a href={block_list[detailcnt].ipfsHash} target="_blank" rel="noopener noreferrer">
                        {block_list[detailcnt].ipfsHash}
                        </a>
                        <br></br>
                        <br></br>
  
  
                      
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
            </Card>
            </Col>
          </Row>
        )

      }
      
    }

  }


  const nextId = useRef(1);
  
  
  useEffect(() => {



    async function updateAllTransactions(e){
      if(transactionInstance && !first){


    
        await axios.post('http://localhost:3001/api/select_request', null, {
          params: {
          }
        })
        .then(async res => {
          console.log(res)    
    
          for(let i = 0; i < res.data.length; i++){
               
              let temp = "미확인";

              if (res.data[i].request_user_check == 1 && res.data[i].receive_user_check == 1){
                temp = "미확인";
              }
              else if (res.data[i].request_user_check == 0 && res.data[i].receive_user_check == 1){
                temp = "확인";
              }

              if(!(res.data[i].request_user_check == 0 && res.data[i].receive_user_check == 0)){

                block_list.push({
                  id: nextId.current,
                  request_user : res.data[i].request_user,
                  receive_user : res.data[i].receive_user,
                  category : res.data[i].category,
                  name : res.data[i].name,
                  time_stamp : res.data[i].time_stamp,
                  file_des : res.data[i].file_des,
                  checktype : res.data[i].check_type,
                  file_type : res.data[i].file_type,
                  ipfsHash : res.data[i].ipfs_hash,
                  des1 : res.data[i].des1,
                  des2 : res.data[i].des2,
                  des3 : res.data[i].des3,
        
                  des4 : res.data[i].des4,
                  des5 : res.data[i].des5,
                  des6 : res.data[i].des6,
                  des7 : res.data[i].des7,
                  des8 : res.data[i].des8,
                  des9 : res.data[i].des9,
                  des10 : res.data[i].des10,
                  registrant : res.data[i].registrant,
                  responsible : res.data[i].responsible_manager,
                  comment : res.data[i].receive_comment,
                  check : temp,
                  request_user_check : res.data[i].request_user_check,
                  receive_user_check : res.data[i].receive_user_check,
                })

                nextId.current += 1;
              }

            

          }
    
        })
        .catch(e)

        setLoading(true);
        setFirst(true);
        console.log('block_list = ', block_list);

      }

  
    }

    updateAllTransactions();
    sessionStorage.removeItem('search')

}, );

    return(
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Rejected Transactions" className="text-sm-left" />
        </Row>
        {Showboard()}
        {/* Default Light Table */}
        {/* <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Active Users</h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        #
                      </th>
                      <th scope="col" className="border-0">
                        File Name
                      </th>
                      <th scope="col" className="border-0">
                        Registrant
                      </th>
                      <th scope="col" className="border-0">
                        File Type
                      </th>
                      <th scope="col" className="border-0">
                        File Des
                      </th>
                      <th scope="col" className="border-0">
                        Upload Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {repeatboardchild(block_list, page)}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        
        <Pagination
              total={block_list.length}
              limit={limit}
              page={page}
              setPage={setPage}
            /> */}
      </Container>
    )
}

export default RejectedTransaction;