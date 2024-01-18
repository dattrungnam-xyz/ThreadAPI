function createMailTemplate(url, email) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
      <style>
    * {
      font-family: Arial, Helvetica, sans-serif;
      padding:0;
      margin:0;
      box-sizing: border-box;
    }
    .wrapper {
      margin-top:20px;
      margin-left:100px;
    }
    .container {
     
      width: 600px;
    }
    .header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid #ccc;
    }
    .content {
      border-bottom: 1px solid #ccc;
      padding-bottom: 50px;
    }
  </style>
</head>
  <body>
    <div class="wrapper">
      <div class="container">
        <header class="header">
          <div class="logo">
            <img
              style="width: 30px; height: 30px"
              src="https://seeklogo.com/images/T/threads-logo-E9BA734BF6-seeklogo.com.png?v=638252100960000000"
              alt=""
            />
          </div>
        </header>
        <div class="content">
          <p style="padding: 20px 0 20px">Hi guys</p>
          <p style="padding-bottom: 16px">
            We received a request to reset your Thread password. Enter the
            following link to reset your password:
          </p>
          <a href="${url}">${url}</a>
          <p style=" padding-top: 16px">
           <span style="font-weight: bold;">Didn't request this change?</span> <br>
         
          If you didn't forget your password, please ignore this email!</p>
        </div>
        <footer>
          <small style="padding:20px 0">
            <div style="padding-top:20px">  This message was sent to ${email} 
            </div>
                <div>
                    To help keep your account secure,
                    please don't forward this email.
                </div>
          </small>
        </footer>
      </div>
    </div>
  </body>
</html>`;
}
export { createMailTemplate };
