import './App.css';
import React, { useEffect, useState } from "react";

import { Jumbotron, Button, Card } from 'react-bootstrap'
function BatmanCard() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);


    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(async () => {
        const gameData = await fetch("https://www.cheapshark.com/api/1.0/games?title=batman&limit=60&exact=0")
            .then(res => res.json())
            .then(
                (result) => {
                    /* setIsLoaded(true);
                    setItems(result); */
                    return result
                },


                (error) => {
                    /* setIsLoaded(true);
                    setError(error); */
                    return false
                }
            )



        if (!!gameData) {
            const functionWithPromise = async game => { //a function that returns a promise
                const id = game.gameID;
                const priceData = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${id}`)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            return result
                        },


                        (error) => {
                            return false
                        }
                    )


                var arr = [];
                var arrN = [];
                var infoId;
                priceData.deals.map(saving => {
                    arr.push(saving.savings);
                })
                arrN = arr.sort(function (a, b) { return b - a; });

                priceData.deals.map(saving => {
                    if (saving.savings == arrN[0]) {
                        priceData.maxRetail = saving.retailPrice;
                        priceData.minPrice = saving.price;
                        priceData.findDealId = saving.dealID;
                        infoId = saving.dealID;
                        priceData.findStore = saving.storeID;
                    }
                })

                priceData.maxDiscount = arrN[0];
                console.log(infoId);

                const gameInfo = await fetch(`https://www.cheapshark.com/api/1.0/deals?id=${infoId}`)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            return result
                        },


                        (error) => {
                            return false
                        }
                    )

                const allData = { ...priceData, ...game, ...gameInfo }



                return Promise.resolve(allData)
            }

            const anAsyncFunction = async item => {
                return functionWithPromise(item)
            }

            const getData = async () => {
                return Promise.all(gameData.map(item => anAsyncFunction(item)))
            }

            getData().then(data => {
                setItems(data);
                setIsLoaded(true);
                console.log(data)
            })

            // setItems(allData);

        } else {
            setError("İlk aşamada hata")
            return;
        }


    }, [])



    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                {items.map(item => (
                    <>
                        <Jumbotron className="d-flex justify-content-center">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={item.thumb} />
                                <Card.Body>
                                    <Card.Title>{item.external}</Card.Title>
                                    <Card.Text>
                                        {item.gameInfo.steamRatingText}
                                    </Card.Text>
                                    <Button variant="primary" className="px-5 mr-4 btnOrder">Order</Button>
                                    <Button variant="secondary">Detail</Button>
                                    <div className="product-price mt-3">
                                        <small>${item.minPrice}</small><b>${item.maxRetail}</b> <b className="discount">discount: {Math.ceil(item.maxDiscount)}% </b>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Jumbotron>

                    </>
                ))}

            </>
        );
    }
}








export default BatmanCard;




