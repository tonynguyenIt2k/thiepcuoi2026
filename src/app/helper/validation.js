export default function validation({ name, wish, isAttend }) {
  if (name.trim() === "") {
    alert("Vui lòng cho chúng tôi biết tên hoặc nickname của bạn !");
    return false;
  } else if (name.trim().length > 30) {
    alert("Vui lòng nhập tên của bạn dưới 30 kí tự");
    return false;
  }
  if (wish.trim() === "") {
    alert("Vui lòng nhập lời chúc của bạn ! ");
    return false;
  } else if (wish.trim().length > 300) {
    alert("Vui lòng nhập lời chúc của bạn dưới 300 kí tự");
    return false;
  } else if (wish.trim().length < 20) {
    alert("Vui lòng nhập lời chúc của bạn trên 20 kí tự");
    return false;
  }
  if (isAttend === null) {
    alert("Hãy cho chúng tôi biết bạn có đến tham dự hay không !");
    return false;
  }

  return true;
}
