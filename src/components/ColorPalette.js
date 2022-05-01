const ColorPalette = ({ color }) => {
  // 포스트잇 색상 변경
  const onColorClick = (e) => {
    const {
      target: { id },
    } = e;
    const $clickedPost = document.querySelector(".post");
    const $clickedPostIt = document.querySelector(".postIt");

    $clickedPost.animate(
      { backgroundColor: id },
      { duration: 400, fill: "forwards" }
    );
    $clickedPostIt.animate(
      { backgroundColor: id },
      { duration: 400, fill: "forwards" }
    );
    setTimeout(() => {
      $clickedPost.style.backgroundColor = id;
      $clickedPostIt.style.backgroundColor = id;
    }, 100);
  };
  return (
    <div
      id={color}
      className="colorButton"
      style={{ backgroundColor: color }}
      onClick={onColorClick}
    ></div>
  );
};

export default ColorPalette;
