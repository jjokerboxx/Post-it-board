import { dbService } from "fbase";
import { collection, addDoc, getDocs } from "@firebase/firestore";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [tweet, setTweet] = useState("");
  const [twtArry, setTwtArry] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const nweet = {
      tweet: tweet,
      uploadedAt: Date.now()
    }
    const docRef = await addDoc(collection(dbService, "Tweet"), nweet);
    console.log("Document written with ID: ", docRef.id);

    document.querySelector("#tweet").value = "";
    // renderTweet();
  }

  const onChange = (e) => {
    const {target:{value}, } = e;
    setTweet(value);
  }

  //순서대로 출력 어떻게????

  const renderTweet = async () => {
    // document.querySelector(".tweet").innerHTML = "";
    const twt = await getDocs(collection(dbService, "Tweet"));
    twt.forEach(elem => {
      const twtObj = {
        tweet: elem.data().tweet,
        uploadedAt: Date(elem.data().uploadedAt)
      }
      setTwtArry((prev) => [twtObj, ...prev]);
    })
    // 이렇게 붙일 수도 있지만 매 클릭마다 반목문을 호출하기 보다 배열 티런하는 것이 더 빠른가????
    // JSX와 forEach 둘 중 어느 코드가 더 효율적인가??
    // twt.forEach(element => {
    //   document.querySelector(".tweet").innerHTML += `<div><p>${element.data().tweet}</p> <p>${Date(element.data().uploadedAt)}</p></div>`;
    // })
  }
  useEffect(renderTweet, [twtArry]);
  return(
    <>
      <div>
        <form>
          <input type="text" id="tweet" value={tweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120}></input>
          <button onClick={onSubmit}>Nweet!</button>
        </form>
      </div>

      <div className="tweet">
        {twtArry.forEach(element =>
          <div>
            <p>
              {element.tweet}
            </p>
            <p>
              {element.uploadedAt}
            </p>
          </div>
        )}
      </div>

    </>
  )
};

export default Home;