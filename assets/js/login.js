$(function () {
  // 绑定点击registerForm事件
  $("#link_reg").on("click", function () {
    // console.log("registerTab点击了");
    //点击后给 registerForm 的show 类去掉，fade类加上，loginForm加上一个show类
    $("#registerForm").addClass("d-none");
    $("#loginForm").removeClass("d-none");
  });
  // 绑定点击loginForm事件
  $("#link_login").on("click", function () {
    $("#loginForm").addClass("d-none");
    $("#registerForm").removeClass("d-none");
  });

  //提示框
  function showMsg(message, duration = 5000) {
    const msgBox = $(
      '<div class="alert alert-warning position-fixed top-50 start-50 translate-middle text-center shadow" style="z-index:9999; border:1px solid rgba(79, 137, 196); padding:20px;"></div>'
    )
      .text(message)
      .appendTo("body");

    setTimeout(() => msgBox.fadeOut(3000, () => msgBox.remove()), duration);
  }
  // 表格registerForm的验证+submit
  // 绑定Sign Up submit事件
  $("#registerForm").on("submit", function (e) {
    // 阻止默认提交
    e.preventDefault();
    //   验证表格填入是否符合要求
    const username = $("#registerUsername").val().trim();
    const password = $("#registerPassword").val().trim();
    const psd2 = $("#psd2").val().trim();
    // 正则表达
    const usernameRegex = /^[a-zA-Z0-9_-]{4,16}$/;
    const passworkRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;

    if (!usernameRegex.test(username)) {
      alert("Please enter username with at least 4-12 digis or letters");
      return;
    }
    if (!passworkRegex.test(password)) {
      alert("Please enter password with 6-12 digits or letters");
      return;
    }
    if (psd2 !== password) {
      alert("Please confirm password again.");
      return;
    }
    // 开始ajax请求
    //开始data写在$.post里面，但会让代码太多，抽取出来
    let data = {
      username: $("#registerForm [name=username]").val(),
      password: $("#registerForm [name=psd]").val(),
    };
    $.post("http://localhost:3000/users", data, function (res) {
      if (res.status !== 201) {
        return showMsg(res.message);
      }
      showMsg("You've registered successfully!Please login.");
      // 切换到login页面，模拟人点击切换
      $("#link_reg").click();
      console.log("333");
    });
  });

  // 绑定Sign in submit事件,验证+submit
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    //   表格验证
    const loginUsername = $("#loginUsername").val().trim();
    const loginPassword = $("#loginPassword").val().trim();
    // 正则表达
    const loginUsernameRegex = /^[a-zA-Z0-9_-]{4,16}$/;
    const loginPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;

    if (!loginUsernameRegex.test(loginUsername)) {
      alert("Please enter username with at least 4-12 digis or letters");
      return;
    }
    if (!loginPasswordRegex.test(loginPassword)) {
      alert("Please enter password with 6-12 digits or letters");
      return;
    }
    console.log("666");

    $.ajax({
      url: "http://localhost:3000/users",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        username: $("#loginForm [name=username]").val(),
        password: $("#loginForm [name=password]").val(),
      }),
      success: function (res) {
        if (res.status !== 201) {
          return showMsg("Login faild");
        }
        console.log(res);

        showMsg("Login successfully");
        //   有部分内容是需要权限才能使用，需要token，可以把相应token存到localStorage 中，但我自己的后台是没有这个功能的。
        localStorage.setItem("token", res.token);
        //   之后跳转在主页
        location.href = "/index.html";
      },
    });
  });
});
