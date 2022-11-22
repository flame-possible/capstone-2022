import React, { useRef, useEffect, useState } from "react";
import moment from 'moment';
// 안써도 자동으로 한국 시간을 불러온다. 명확하게 하기 위해 import
import 'moment/locale/ko';

import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormGroup,
  FormRadio,
  FormSelect,
  Button
} from "shards-react";
import { create as ipfsHttpClient } from 'ipfs-http-client'


import Axios from 'axios';
import CryptoJS from 'crypto-js'

// const ipfsClient = require('ipfs-http-client');

const projectId = '2DCS0fCRlt3GtE33WGUMaHo05dI';
const projectSecret = '1df2c89edfa1422733bd46ebf81be1fa';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
    host: 'infura-ipfs.io',
    port: 5001,
    protocol: 'https',
    // apiPath: '/api/v0',
    headers: {
        authorization: auth,
    },
});

// const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')



function CompleteFormExample({transactionInstance, account}){

  const [CategorySelect, setCategorySelect] = useState("")
  const [Filename, setFilename] = useState("")
  const [Filedes, setFiledes] = useState("")
  const [Regsitrant, setRegsitrant] = useState("")
  const [Responsible, setResponsible] = useState("")
  const [ipfsHash, setIpfsHash] = useState("");
  const [Filetype, setFiletype] = useState("");
  const [CheckListType, setCheckListType] = useState("");
  
  const [file, setFile] = useState({})
  const [fileUrl, setFileUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const [des, setdes] = useState([0]);

  const uploadFile = async (e) => {
    // setLoading(true)
    e.preventDefault()

    try {
      console.log('Error ipfs')
        const added = await client.add(file);
        console.log('Error ipfs')
        console.log(file)
        console.log(added)
        const url = `https://safetymanagement.infura-ipfs.io/ipfs/${added.path}`
        console.log(url)
        // setUrl(url)
        setFileUrl(url)
        setUploaded(true)
        setIpfsHash(ipfsHash => added.path)
        setLoading(true)
    } catch (err) {
        console.log('Error uploading the file : ', err)
        setLoading(false)
    }
}

const preUpload = (e) => {
    if (e.target.value !== '') {
        setFile(e.target.files[0])
    } else {
        setFile({})
    }
}

  // send 전자문서 블록체인
  const sendTransaction = async (e) => {

    let cnt = file.name.length;
    let target = '';
    for(let i = cnt-1; i > 0; i-- ){
      target += file.name[i];
      if(file.name[i] == '.') break;
    }
    let temp = '';
    for(let i = target.length-2; i >= 0; i--){
      temp += target[i];
    }
    console.log(ipfsHash)
    await transactionInstance.sendTrans(CategorySelect, Filename, ipfsHash, Regsitrant, Responsible, temp, Filedes,{
      from: account,
      //value: e.web3.utils.toWei('10', "ether"),
      gas: 1000000
    })


    let events = await transactionInstance.getPastEvents('handleTransaction', {fromBlock: 0, toBlock:'latest'});
    console.log(events[events.length-1].transactionHash)
    //this.updateAllTransactions();
    window.location.replace("/")
    // submitReview();
  }
  
  // send 체크리스트 블록체인
  const sendChecklistTransaction = async (e) => {
    await transactionInstance.sendCheckTrans(CategorySelect, CheckListType, Regsitrant, Responsible, des, {
      from: account,
      //value: e.web3.utils.toWei('10', "ether"),
      gas: 1000000
    })
    
    let events = await transactionInstance.getPastEvents('checkTransaction', {fromBlock: 0, toBlock:'latest'});
    console.log(events)
    //this.updateAllTransactions();
    window.location.replace("/")
    // submitReview();
}

  // send 전자문서 db
  const onClick_send_db_docu = () => {

    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    
    
    let cnt = file.name.length;
    let target = '';
    for(let i = cnt-1; i > 0; i-- ){
      target += file.name[i];
      if(file.name[i] == '.') break;
    }
    let temp = '';
    for(let i = target.length-2; i >= 0; i--){
      temp += target[i];
    }
    
    var fileurl = 'https://ipfs.infura.io/ipfs/' + ipfsHash;

    Axios.post('http://ec2-52-78-43-195.ap-northeast-2.compute.amazonaws.com:3001/api/insert_docu', null, {
        params: {
        'request_user': sessionStorage.getItem('user_id'),
        'receive_user': "bbb",
        'category': CategorySelect,
        'name': Filename,
        'time_stamp': nowTime,
        'ipfs_hash': fileurl,
        'registrant': Regsitrant,
        'responsible_manager': Responsible,
        'file_type': temp,
        'file_des': Filedes,
        'request_user_check': 0,
        'receive_user_check': 0
        }
    })
    .then(res => {
    
      console.log(res)
      alert('등록 완료')
      document.location.href = '/'
    })
    .catch()
  }

  
  // send 체크리스트 db
  const onClick_send_db_check = () => {

    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    

    Axios.post('http://ec2-52-78-43-195.ap-northeast-2.compute.amazonaws.com:3001/api/insert_check', null, {
        params: {
        'request_user': sessionStorage.getItem('user_id'),
        'receive_user': "bbb",
        'category': CategorySelect,
        'check_type': CheckListType,
        'time_stamp': nowTime,
        'registrant': Regsitrant,
        'responsible_manager': Responsible,
        'des1': des[0],
        'des2': des[1],
        'des3': des[2],
        'des4': des[3],
        'des5': des[4],
        'des6': des[5],
        'des7': des[6],
        'des8': des[7],
        'des9': des[8],
        'des10': des[9],
        'request_user_check': 0,
        'receive_user_check': 0
        }
    })
    .then(res => {
    
      console.log(res)
      alert('등록 완료')
      document.location.href = '/'
    })
    .catch()
  }
  
  const category_select = (e) => {
    setCategorySelect(e.target.value);
    console.log(CategorySelect);
  };

  const checklist_select = (e) => {
    setCheckListType(e.target.value);
    console.log(CheckListType);
  };
  
  const ipfsupload = (e) => {
    setFileUrl(e.target.value);
    // setFiletype(fileUrl);
    // setLoading(true);
    preUpload(e);
  }

  const uploadbutton = () => {
    if (file.name) {
    return (
      <div>
    {ipfsHash ? (
      <h5>
          Uploaded Successfully ✅
      </h5>
  ) : 
  (
      <Button outline theme="secondary" className="mb-2 mr-1" onClick={uploadFile}>Upload File</Button>
  )}
  </div>
    )
  }
  }




  const CustomFileUpload = () => {

    return (
    <div className="custom-file mb-3">
    <input type="file" className="custom-file-input" id="customFile2" 
                onChange = {ipfsupload}/>
    {file.name ?
    
       (<label className="custom-file-label" htmlFor="customFile2">
       {file.name}
        </label>) : 
        (<label className="custom-file-label" htmlFor="customFile2">
       파일을 선택하세요
        </label>)
    }
    </div>
    )
  }

  
  useEffect(() => {

    if (des.length < 10){
      for(let i = 0; i < 10; i++){
        des.push(0);
      }
    }
    

}, );


  return(
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col>
            <Form>
              <FormGroup>
                <label htmlFor="feInputState">카테고리</label>
                <FormSelect id="feInputState" value={CategorySelect} onChange={category_select}>
                  {/* <option>CCTV</option> */}
                  <option value = "선택">선택</option>
                  <option value = "Document">전자문서</option>
                  <option value = "CheckList">체크리스트</option>
                  <option value = "CCTV">CCTV</option>
                  <option value = "Temp">온도 센서</option>
                  <option value = "Pressure">압력 센서</option>
                  <option value = "Ray">적외선 센서</option>
                  {/* <option>온도 센서</option>
                  <option>압력 센서</option>
                  <option>적외선 센서</option>  */}
                </FormSelect>
              </FormGroup>

              {/* 여기서부터 */}
              <div>
                {CategorySelect == "Document" && (
                  <div>
                <FormGroup>
                  <label htmlFor="feInputAddress">파일명</label>
                  <FormInput id="feInputAddress" placeholder="파일명을 입력하세요" onChange = {(event) => setFilename(event.target.value)}/>
                </FormGroup>

                <FormGroup>
                  <label htmlFor="feInputAddress2">파일 설명</label>
                  <FormInput
                    id="feInputAddress2"
                    placeholder="파일 설명을 입력하세요"
                    onChange = {(event) => setFiledes(event.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="feInputAddress2">업로더 이름</label>
                  <FormInput
                    id="feInputAddress2"
                    placeholder="업로더 이름을 입력하세요"
                    onChange = {(event) => setRegsitrant(event.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="feInputAddress2">업로드 책임자</label>
                  <FormInput
                    id="feInputAddress2"
                    placeholder="업로드 책임자를 입력하세요"
                    onChange = {(event) => setResponsible(event.target.value)}
                  />
                </FormGroup>
                <strong className="d-block mb-2">
                  파일 업로드
                </strong>
                <CustomFileUpload />

                {uploadbutton()}
                <Button outline theme="secondary" className="mb-2 mr-1" onClick={onClick_send_db_docu}>트랜잭션 업로드</Button>
                {/* <Button outline theme="secondary" className="mb-2 mr-1" onClick={sendTransaction}>트랜잭션 업로드</Button> */}
              </div>
            )}

            {CategorySelect == "CheckList" && (
              <div>
                  <FormGroup>
                    <label htmlFor="feInputState">체크리스트</label>
                    <FormSelect id="feInputState" value={CheckListType} onChange={checklist_select}>
                      <option value = "선택">선택</option>
                      <option value = "Construction">건설기계·장비</option>
                      <option value = "Welding">용접 작업</option>
                      <option value = "Electricity">가설전기 및 전기공사</option>
                  </FormSelect>
                  </FormGroup>

                  {CheckListType == "Construction" && (
                    <div>
                      <FormGroup>
                        <label htmlFor="feInputAddress2">업로더 이름</label>
                        <FormInput
                          id="feInputAddress2"
                          placeholder="업로더 이름을 입력하세요"
                          onChange = {(event) => setRegsitrant(event.target.value)}
                        />
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="feInputAddress2">업로드 책임자</label>
                          <FormInput
                            id="feInputAddress2"
                            placeholder="업로드 책임자를 입력하세요"
                            onChange = {(event) => setResponsible(event.target.value)}
                        />
                      </FormGroup>
                      <label htmlFor="feInputAddress2">1. 자격을 갖춘 자에게 운전을 하도록 하였다.</label>
                      <br></br>
                      <FormRadio inline name="construct1" onChange={() => {des[0] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct1" onChange={() => {des[0] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">2. 형식신고 및 안전인증·검사 등 기계별 필요한 검사를 받았는지 확인했다.</label>
                      <br></br>
                      <FormRadio inline name="construct2" onChange={() => {des[1] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct2" onChange={() => {des[1] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">3. 건설기계의 운행경로 및 작업방법을 고려해 기계별 작업계획을 수립·이행하고, 작업지휘자를 지정하여 지휘·감독했다.</label>
                      <br></br>
                      <FormRadio inline name="construct3" onChange={() => {des[2] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct3" onChange={() => {des[2] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">4. 작업 전 운전자 및 작업자 안전교육을 실시했다.</label>
                      <br></br>
                      <FormRadio inline name="construct4" onChange={() => {des[3] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct4" onChange={() => {des[3] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">5. 작업장소의 지형 및 지반상태를 확인하고, 기계가 넘어질 우려가 없도록 조치했다.</label>
                      <br></br>
                      <FormRadio inline name="construct5" onChange={() => {des[4] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct5" onChange={() => {des[4] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">6. 작업구간에 작업자의 출입을 금지하거나 유도자를 배치하여 차량을 유도하였다.</label>
                      <br></br>
                      <FormRadio inline name="construct6" onChange={() => {des[5] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct6" onChange={() => {des[5] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">7. 유도자는 정해진 신호방법에 따라 차량을 유도했다.</label>
                      <br></br>
                      <FormRadio inline name="construct7" onChange={() => {des[6] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct7" onChange={() => {des[6] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">8. 건설기계는 주된 용도로만 사용하여야 했다.</label>
                      <br></br>
                      <FormRadio inline name="construct8" onChange={() => {des[7] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct8" onChange={() => {des[7] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">9. 승차석이 아닌 곳에 작업자를 탑승시키지 않았다.</label>
                      <br></br>
                      <FormRadio inline name="construct9" onChange={() => {des[8] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct9" onChange={() => {des[8] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">10. 지정된 제한속도를 준수하였다.</label>
                      <br></br>
                      <FormRadio inline name="construct10" onChange={() => {des[9] = 1}}>예</FormRadio>     
                      <FormRadio inline name="construct10" onChange={() => {des[9] = 0}}>아니요</FormRadio>
                      <br></br>
                      {/* <Button outline theme="secondary" className="mb-2 mr-1" onClick={onClick_send_db_check}>트랜잭션 업로드</Button> */}
                      <Button outline theme="secondary" className="mb-2 mr-1" onClick={onClick_send_db_check}>트랜잭션 업로드</Button>
                    </div>
                  )}
                  {CheckListType == "Welding" && (
                    <div>
                      <FormGroup>
                        <label htmlFor="feInputAddress2">업로더 이름</label>
                        <FormInput
                          id="feInputAddress2"
                          placeholder="업로더 이름을 입력하세요"
                          onChange = {(event) => setRegsitrant(event.target.value)}
                        />
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="feInputAddress2">업로드 책임자</label>
                          <FormInput
                            id="feInputAddress2"
                            placeholder="업로드 책임자를 입력하세요"
                            onChange = {(event) => setResponsible(event.target.value)}
                        />
                      </FormGroup>
                      <label htmlFor="feInputAddress2">1. 화재위험작업에 대한 작업계획을 수립하였다.</label>
                      <br></br>
                      <FormRadio inline name="welding1" onChange={() => {des[0] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding1" onChange={() => {des[0] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">2. 작업장 내 위험물, 가연물의 사용·보관 현황을 파악하였다.</label>
                      <br></br>
                      <FormRadio inline name="welding2" onChange={() => {des[1] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding2" onChange={() => {des[1] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">3. 위험물질로 인한 응급상황이 발생했을 때 필요한 행동에 대한 정보를 미리 준비하였다.</label>
                      <br></br>
                      <FormRadio inline name="welding3" onChange={() => {des[2] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding3" onChange={() => {des[2] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">4. 작업현장에 허가받은 위험물의 종류별 기준량 이상이 되면 지역 소방기관과 관계기관에 신고하였다.</label>
                      <br></br>
                      <FormRadio inline name="welding4" onChange={() => {des[3] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding4" onChange={() => {des[3] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">5. 소방서로부터 허가받은 위험물 제조소 또는 저장소 자료를 토대로 현장에 위험물의 종류별로 기준 이상의 위험물이 존재하거나 앞으로 존재하게 될 것인지의 여부를 판단하였다.</label>
                      <br></br>
                      <FormRadio inline name="welding5" onChange={() => {des[4] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding5" onChange={() => {des[4] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">6. 작업자에 대해 화재예방 및 피난 교육 등을 실시하였다.</label>
                      <br></br>
                      <FormRadio inline name="welding6" onChange={() => {des[5] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding6" onChange={() => {des[5] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">7. 화재위험작업 대상 작업자에게 특별안전보건교육을 실시하였다.</label>
                      <br></br>
                      <FormRadio inline name="welding7" onChange={() => {des[6] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding7" onChange={() => {des[6] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">8. 산소, LPG 등 가스 용기는 전도 위험이 없는 곳에 보관하며, 사용 전 또는 사용 중인 용기와 그 밖의 용기를 명확히 구별하여 보관하였다.</label>
                      <br></br>
                      <FormRadio inline name="welding8" onChange={() => {des[7] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding8" onChange={() => {des[7] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">9. 작업을 중단하거나 마치고 작업장소를 떠날 경우에는 가스 등의 공급구의 밸브나 콕을 잠구었다.</label>
                      <br></br>
                      <FormRadio inline name="welding9" onChange={() => {des[8] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding9" onChange={() => {des[8] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">10. 인화성 가스 및 산소를 사용하여 금속을 용접·용단하는 경우, 지정된 자격증*의 보유 여부를 확인하였다.</label>
                      <br></br>
                      <FormRadio inline name="welding10" onChange={() => {des[9] = 1}}>예</FormRadio>     
                      <FormRadio inline name="welding10" onChange={() => {des[9] = 0}}>아니요</FormRadio>
                      <br></br>
                      {/* <Button outline theme="secondary" className="mb-2 mr-1" onClick={onClick_send_db_check}>트랜잭션 업로드</Button> */}
                      <Button outline theme="secondary" className="mb-2 mr-1" onClick={onClick_send_db_check}>트랜잭션 업로드</Button>
                    </div>
                  )}
                  {CheckListType == "Electricity" && (
                    <div>
                      <FormGroup>
                        <label htmlFor="feInputAddress2">업로더 이름</label>
                        <FormInput
                          id="feInputAddress2"
                          placeholder="업로더 이름을 입력하세요"
                          onChange = {(event) => setRegsitrant(event.target.value)}
                        />
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="feInputAddress2">업로드 책임자</label>
                          <FormInput
                            id="feInputAddress2"
                            placeholder="업로드 책임자를 입력하세요"
                            onChange = {(event) => setResponsible(event.target.value)}
                        />
                      </FormGroup>
                      <label htmlFor="feInputAddress2">1. 감전위험이 있는 전기 기계·기구 또는 전로의 설치·해체·정비·점검 등의 작업을 하는 하는 경우 작업자의 자격을 확인하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec1" onChange={() => {des[0] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec1" onChange={() => {des[0] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">2. 감전의 위험이 있는 작업에 종사하는 경우 절연용 보호구를 지급하고 작업자에게 착용하도록 하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec2" onChange={() => {des[1] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec2" onChange={() => {des[1] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">3. 가공전로에 근접하여 비계를 설치하는 경우에는 가공전로를 이설하거나 가공전로에 절연용 방호구를 장착하는 등 가공전로와의 접촉을 방지하기 위해 조치 하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec3" onChange={() => {des[2] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec3" onChange={() => {des[2] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">4. 임시 수전설비의 주변은 관계 작업자가 아닌 사람의 출입을 금지하고, 위험표시 등의 방법으로 방호를 강화하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec4" onChange={() => {des[3] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec4" onChange={() => {des[3] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">5. 가설 배전반·분전반은 충전부가 노출되지 않도록 폐쇄형 외함이 있는 구조로 설치하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec5" onChange={() => {des[4] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec5" onChange={() => {des[4] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">6. 충전부는 충분한 절연효과가 있는 방호망이나 절연덮개를 설치하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec6" onChange={() => {des[5] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec6" onChange={() => {des[5] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">7. 분전반 등 전기 기계·기구의 금속제 외함, 금속제 외피 및 철대는 접지를 실시하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec7" onChange={() => {des[6] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec7" onChange={() => {des[6] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">8. 배선 또는 이동전선의 절연피복이 손상되거나 노화됨으로 인한 감전의 위험을 방지하기 위한 조치를 하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec8" onChange={() => {des[7] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec8" onChange={() => {des[7] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">9. 습윤한 장소의 이동전선 및 부속 접속기구는 충분한 절연효과가 있는 것을 사용하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec9" onChange={() => {des[8] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec9" onChange={() => {des[8] = 0}}>아니요</FormRadio>
                      <br></br>
                      <label htmlFor="feInputAddress2">10. 통로바닥에 전선 또는 이동전선 등을 설치하여 사용하지 않도록 관리하였다.</label>
                      <br></br>
                      <FormRadio inline name="elec10" onChange={() => {des[9] = 1}}>예</FormRadio>     
                      <FormRadio inline name="elec10" onChange={() => {des[9] = 0}}>아니요</FormRadio>
                      <br></br>
                      {/* <Button outline theme="secondary" className="mb-2 mr-1" onClick={onClick_send_db_check}>트랜잭션 업로드</Button> */}
                      <Button outline theme="secondary" className="mb-2 mr-1" onClick={onClick_send_db_check}>트랜잭션 업로드</Button>
                    </div>
                  )}

              </div>
            )}
          </div>
          {/* 여기까지 */}
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  )
                };


export default CompleteFormExample;
