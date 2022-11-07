import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../common/PageTitle";
import Pagination from "../pagination.js";
import moment from "moment";

import {
  ListGroup,
  ListGroupItem,
  Form,
  FormInput,
  FormGroup,
  FormCheckbox,
  FormSelect,
  Button
} from "shards-react";


function All({transactionInstance}){
  
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [block_list, setblock_list] = useState([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(false);

  const [detail, setDetail] = useState(false);
  const [detailcnt, setDetailcnt] = useState(-1);

  const detail_click = (cnt) => {
    setDetail(true);
    setDetailcnt(cnt);
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
          if (child[i].des1 == 0 || child[i].des1 == 1){
            arr.push(
              <tr key={i} onClick={() => detail_click(i)} style={{cursor: "pointer"}}>
                <th scope="row" >{i+1}</th>
                <td >{child[i].checktype}</td>
                <td>{child[i].responsible}</td>
                <td>{child[i].filetype}</td>
                <td>{child[i].filedes}</td>
                <td>{child[i].real_time}</td>
              </tr>
              )
          }
          else{
            arr.push(
              <tr key={i} onClick={() => detail_click(i)} style={{cursor: "pointer"}}>
                <th scope="row" >{i+1}</th>
                <td >{child[i].name}</td>
                <td>{child[i].responsible}</td>
                <td>{child[i].filetype}</td>
                <td>{child[i].filedes}</td>
                <td>{child[i].real_time}</td>
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
              <h6 className="m-0">Form Example</h6>
            </CardHeader>
              <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
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
                        {block_list[detailcnt].filedes}
                      
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


        console.log(transactionInstance)
        let events = await transactionInstance.getPastEvents('handleTransaction', {fromBlock:0, toBlock:'latest'});
        
  
  
        for(let i = events.length - 1; i >= 0; i--){
          
          var time_ = moment.unix(events[i].returnValues.time);
          var fileurl = 'https://ipfs.infura.io/ipfs/';
          fileurl += events[i].returnValues.ipfs_hash.toString();
          
          console.log(fileurl)
          
          block_list.push({
            id: nextId.current,
            category : events[i].returnValues.category.toString(),
            name : events[i].returnValues.name.toString(),
            // time : time_,
            // time : time_.toString(), 
            time : parseInt(events[i].returnValues.time), 
            real_time : time_.toString(),
            ipfsHash : fileurl,
            registrant : events[i].returnValues.registrant.toString(),
            responsible : events[i].returnValues.responsible_manager.toString(),
            filetype : events[i].returnValues.file_type.toString(),
            filedes : events[i].returnValues.file_description.toString()
          }
          )
          
          nextId.current += 1;
  
          console.log(events[i].returnValues);
        }
        // setLoading(true);
        // setFirst(true);
        console.log('events.length = ', events.length);
        console.log(events);
        console.log('block_list = ', block_list);


        let events_ = await transactionInstance.getPastEvents('checkTransaction', {fromBlock:0, toBlock:'latest'});
        
        for(let i = events_.length - 1; i >= 0; i--){
            
          var time_ = moment.unix(events_[i].returnValues.time);
          let temp_des = [];
          for(let j = 0; j < 10; j++){
            let temp = 0;
            if(events_[i].returnValues.des[j].toString() == "true"){
              temp = 1;
            }
            temp_des.push(temp)
          }
          
          block_list.push({
            id: nextId.current,
            category : events_[i].returnValues.category.toString(),
            checktype : events_[i].returnValues.checktype.toString(),
            // time : time_,
            // time : time_.toString(), 
            time : parseInt(events[i].returnValues.time), 
            real_time : time_.toString(),
            des1 : temp_des[0],
            des2 : temp_des[1],
            des3 : temp_des[2],
  
            des4 : temp_des[3],
            des5 : temp_des[4],
            des6 : temp_des[5],
            des7 : temp_des[6],
            des8 : temp_des[7],
            des9 : temp_des[8],
            des10 :temp_des[9],
            registrant : events_[i].returnValues.registrant.toString(),
            responsible : events_[i].returnValues.responsible_manager.toString(),
          }
          )
          
          nextId.current += 1;
  
          console.log(events_[i].returnValues);
        }

        
        let i, j;

        for(i = 0; i < block_list.length; i++){
          
          let temp_list;
          let temp_list_cnt = -1;

          for(j = i+1; j < block_list.length; j++){
            if(block_list[i].time < block_list[j].time){
              temp_list = block_list[j];
              temp_list_cnt = j;
            }
          }

          if(temp_list_cnt != -1){
            block_list[temp_list_cnt] = block_list[i];
            block_list[i] = temp_list;
          }

        }
        

        setLoading(true);
        setFirst(true);
        console.log('events.length = ', events.length);
        console.log(events);
        console.log('block_list = ', block_list);

      }

  
    }

    updateAllTransactions();
    sessionStorage.removeItem('search')

}, );

    return(
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="All" className="text-sm-left" />
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

export default All;

