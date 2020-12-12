import React, { useEffect, useState } from 'react';
import { 
    Layout, 
    Input, 
    Row, 
    Col, 
    Card, 
    Tag, 
    Spin, 
    Alert, 
    Modal, 
    Typography 
} from 'antd';
import 'antd/dist/antd.css';

const API_KEY = 'ada3316a';
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;
const SearchBox = ({searchHandler}) => {
    return (
        <Row>
            <Col span={12} offset={6}>
                <Search
                    placeholder="enter movie, series, episode name"
                    enterButton="Search"
                    size="large"
                    id="search"
                    onSearch={value => searchHandler(value)}
                />
            </Col>
        </Row>
    )
}
const ColCardBox = ({Title, imdbID, Poster, Type, ShowDetail, DetailRequest, ActivateModal}) => {

    const clickHandler = () => {

        ActivateModal(true);
        DetailRequest(true);

        fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(response => {
            DetailRequest(false);
            ShowDetail(response);
        })
        .catch(({message}) => {
            DetailRequest(false);
        })
    }

    return (
        <Col style={{margin: '1.5rem 0rem' }} className="gutter-row" span={5}>
            <div className="gutter-box">
                <Card
                    style={{ width: 200 }}
                    cover={
                        <img
                            alt={Title}
                            src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster}
                        />
                    }
                    onClick={() => clickHandler()}
                >
                    <Meta
                            title={Title}
                            description={false}
                    />
                    <Row style={{marginTop: '10px'}} className="gutter-row">
                        <Col>
                            <Tag color="magenta">{Type}</Tag>
                        </Col>
                    </Row>
                </Card>
            </div>
        </Col>
    )
}

const MovieDetail = ({Title, Poster, imdbRating, Rated, Runtime, Genre, Plot}) => {
    return (
       
        <Row>
            <Col span={11}>
                <img 
                    src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster} 
                    alt={Title} 
                />
            </Col>
            <Col span={13}>
                <Row>
                    <Col span={21}>
                        <TextTitle level={4}>{Title}</TextTitle></Col>
                    <Col span={3} style={{textAlign:'right'}}>
                        <TextTitle level={4}><span style={{color: '#41A8F8'}}>imdb{imdbRating}</span></TextTitle>
                    </Col>
                </Row>
                <Row style={{marginBottom: '1.2rem'}}>
                    <Col>
                        <Tag>{Rated}</Tag> 
                        <Tag>{Runtime}</Tag> 
                        <Tag>{Genre}</Tag>
                    </Col>
                </Row>
                <Row>
                    <Col>{Plot}</Col>
                </Row>
            </Col>
        </Row>
        
    )
}

const Loader = () => (
    <div style={{margin: '20px 0', textAlign: 'center'}}>
        <Spin />
    </div>
)
function App() {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [q, setQuery] = useState('star wars');
    const [activateModal, setActivateModal] = useState(false);
    const [detail, setShowDetail] = useState(false);
    const [detailRequest, setDetailRequest] = useState(false);

    useEffect(() => {

        setLoading(true);
        setError(null);
        setData(null);

        fetch(`http://www.omdbapi.com/?s=${q}&apikey=${API_KEY}`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(response => {
            if (response.Response === 'False') {
                setError(response.Error);
            }
            else {
                setData(response.Search);                
            }

            setLoading(false);
        })
        .catch(({message}) => {
            setError(message);
            setLoading(false);
        })

    }, [q]);

    
    return (
        <div className="App">
            <Layout className="layout">
                <Header style={{background: '#182A47'}}>
                    <div style={{ textAlign: 'center'}}>
                        <TextTitle style={{color: '#ffffff', marginTop: '1rem'}} level={3}>OMDB API</TextTitle>
                    </div>
                </Header>
                <Content style={{background: '#000F26'}} >
                    <div style={{marginTop:'1.5rem',padding: '0 3rem'  }}>
                        <SearchBox style={{ marginTop:'1rem'}} searchHandler={setQuery} />
                        <br />
                        
                        <Row gutter={16} type="flex" justify="center">
                            { loading &&
                                <Loader />
                            }

                            { error !== null &&
                                <div style={{margin: '20px 0'}}>
                                    <Alert message={error} type="error" />
                                </div>
                            }
                            
                            { data !== null && data.length > 0 && data.map((result, index) => (
                                <ColCardBox 
                                    ShowDetail={setShowDetail} 
                                    DetailRequest={setDetailRequest}
                                    ActivateModal={setActivateModal}
                                    key={index} 
                                    {...result} 
                                />
                            ))}
                        </Row>
                    </div>
                    <Modal style ={{background:'#000F26'}}
                        title='Detail'
                        centered
                        visible={activateModal}
                        onCancel={() => setActivateModal(false)}
                        footer={null}
                        width={800}
                        >
                        { detailRequest === false ?
                            (<MovieDetail {...detail} />) :
                            (<Loader />) 
                        }
                    </Modal>
                </Content>
                <Footer style={{ textAlign: 'center', background:'#182A47', color: '#ffffff' }}>OMDB Movies ©2020</Footer>
            </Layout>
        </div>
    );
}

export default App;
