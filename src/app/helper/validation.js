export default function validation({ name, wish, isAttend }, onError) {
  const triggerError = (msg) => {
    if (onError) {
      onError(msg);
    } else {
      alert(msg);
    }
  };

  if (name.trim() === "") {
    triggerError("Vui lòng cho chúng tôi biết tên hoặc nickname của bạn !");
    return false;
  } else if (name.trim().length > 30) {
    triggerError("Vui lòng nhập tên của bạn dưới 30 kí tự");
    return false;
  }
  if (wish.trim() === "") {
    triggerError("Vui lòng nhập lời chúc của bạn ! ");
    return false;
  } else if (wish.trim().length > 300) {
    triggerError("Vui lòng nhập lời chúc của bạn dưới 300 kí tự");
    return false;
  } else if (wish.trim().length < 20) {
    triggerError("Vui lòng nhập lời chúc của bạn trên 20 kí tự");
    return false;
  }
  if (isAttend === null) {
    triggerError("Hãy cho chúng tôi biết bạn có đến tham dự hay không !");
    return false;
  }

  return true;
}
