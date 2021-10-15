import { dbService } from "fbase";
import { collection, addDoc, getDocs } from "@firebase/firestore";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [tweet, setTweet] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const nweet = {
      tweet: tweet
    }
    const docRef = await addDoc(collection(dbService, "Tweet"), nweet);
    console.log("Document written with ID: ", docRef.id);

    document.querySelector("#tweet").value = "";
    renderTweet();
  }

  const onChange = (e) => {
    const {target:{value}, } = e;
    setTweet(value);
  }

  //순서대로 출력 어떻게????

  const renderTweet = async () => {
    document.querySelector(".tweet").innerHTML = "";
    const twt = await getDocs(collection(dbService, "Tweet"));
    twt.forEach(element => {
      document.querySelector(".tweet").innerHTML += `<div><p>${element.data().tweet}</p></div>`;
    })
  }
  useEffect(renderTweet);
  return(
    <>
      <div>
        <form>
          <input type="text" id="tweet" value={tweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120}></input>
          <button onClick={onSubmit}>Nweet!</button>
        </form>
      </div>

      <div className="tweet">
      </div>

    </>
  )
};

export default Home;