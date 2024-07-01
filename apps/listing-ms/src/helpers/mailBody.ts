import config from "../config/index.js";

function encodeEmail(email: string): string {
  return Buffer.from(email).toString("base64");
}

const constructContactAgentEmailBody = (email: string): string => {
  const encodedEmail = encodeEmail(email);
  const emailBodyHtml = `<!DOCTYPE html>
			<html>
			<head>
				<title>Hello Condo Email</title>
			</head>

			<body style="max-width: 800px; margin: 20px auto; padding: 20px; font-family: Arial, sans-serif;">
				<div class="container" style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff;">
					<div style="text-align: center;">
					<img src="https://${config.s3.pb}.s3.amazonaws.com/assets/logo.png" alt="Hello Condo Logo" style="width: 120px; display: block; margin-left: auto; margin-right: auto;">
					</div>
					<div style="margin-left: 5px;">
						<h1 style="font-size: 14px; color: #333;">Hello!</h1>
						<p style="font-size: 14px; color: #666; line-height: 1.5;">We have received your request to be matched with 
							an agent. We’ll be sharing your information with our partners over at <a href="https://agentpronto.com/">AgentPronto</a>,
							who will follow up with you to learn more and get you matched with the perfect agent. Look out for more
							from them…</p>
						<p style="font-size: 14px; color: #666; line-height: 1.5">In the meantime, you know where to find us if you
							have any questions or suggestions.</p>
						<p style="font-size: 14px; color: #666; line-height: 1.5;">All the best,<br /><span style="color: gray">Team
								Hello Condo</span></p>
					</div>
				</div>
				<div class="footer"
					style="background-color: #E2EAD3; text-align: center; padding: 10px; font-size: 14px; color: #333;">
					<img src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/logo.png" alt="Hello Condo Footer Logo" style="width: 100px;">
					<p style="font-size: 14px; "><a href="mailto:hello@HelloCondo.com">hello@HelloCondo.com</a> <a
							href="https://www.hellocondo.com" target="_blank" style="margin-left: 15px;"> www.HelloCondo.com</a></p>
					<p style="font-size: 14px; color: #333;">No longer want to receive these emails? <a
							href="${process.env.DOMAIN_URL}/unsubscribe?type=speaktoagent&id=${encodedEmail}"
							style="color: #333;">Unsubscribe</a></p>
					<p style="font-size: 14px; color: #333;">Follow for more</p>
					<div class="social-icons">
						<a href="https://www.facebook.com/profile.php?id=61558366690832&sk=about" target="_blank"><img
								src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/Facebook.png" alt="Facebook"
								style="width: 40px; margin: 0 5px;"></a>
						<a href="https://www.instagram.com/hello.condo" target="_blank"><img
								src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/instagram.png"  alt="Twitter"
								style="width: 40px; margin: 0 5px;"></a>
						<a href="https://twitter.com/hello_condo" target="_blank"><img
								src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/twitter.png" alt="Instagram"
								style="width: 40px; margin: 0 5px;"></a>
						<a href="https://www.reddit.com/user/HelloCondo/" target="_blank"><img
								src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/reddit.png" alt="LinkedIn"
								style="width: 40px; margin: 0 5px;"></a>
					</div>
				</div>
			</body>
			</html>`;

  return emailBodyHtml;
};

const constructContactUsEmailBody = (email: string): string => {
  const encodedEmail = encodeEmail(email);
  const emailHtml = `<!DOCTYPE html>
			<html>
			<head>
				<title>Hello Condo Email</title>
			</head>
			<body style="max-width: 800px; margin: 20px auto; padding: 20px; font-family: Arial, sans-serif;">
				<div class="container" style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff;">
					<div style="text-align: center;">
					<img src="https://${config.s3.pb}.s3.amazonaws.com/assets/logo.png" alt="Hello Condo Logo" style="width: 120px; display: block; margin-left: auto; margin-right: auto;">
					</div>
					<div style="margin-left: 5px;">
					<h1 style="font-size: 14px; color: #333;">Hello!</h1>
					<p style="font-size: 14px; color: #666; line-height: 1.5;">Thanks for expressing interest in HelloCondo; we’ll share updates with you as we get closer to launch.</p>
					<p style="font-size: 14px; color: #666; line-height: 1.5;">In the meantime, you know where to find us if you have any questions or suggestions.</p>
					<p style="font-size: 14px; color: #666; line-height: 1.5;">All the best,<br /><span style="color: gray">Team Hello Condo</span></p>
					</div>
				</div>
				<div class="footer"
					style="background-color: #E2EAD3; text-align: center; padding: 10px; font-size: 14px; color: #333;">
					<img src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/logo.png" alt="Hello Condo Footer Logo" style="width: 100px;">
					<p style="font-size: 14px; "><a href="mailto:hello@HelloCondo.com">hello@HelloCondo.com</a> <a
							href="https://www.hellocondo.com" target="_blank" style="margin-left: 15px;"> www.HelloCondo.com</a></p>
					<p style="font-size: 14px; color: #333;">No longer want to receive these emails? <a
							href="${process.env.DOMAIN_URL}/unsubscribe?type=contactus&id=${encodedEmail}"
							style="color: #333;">Unsubscribe</a></p>
					<p style="font-size: 14px; color: #333;">Follow for more</p>
					<div class="social-icons">
						<a href="https://www.facebook.com/profile.php?id=61558366690832&sk=about" target="_blank"><img
								src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/Facebook.png" alt="Facebook"
								style="width: 40px; margin: 0 5px;"></a>
						<a href="https://www.instagram.com/hello.condo" target="_blank"><img
								src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/instagram.png"  alt="Twitter"
								style="width: 40px; margin: 0 5px;"></a>
						<a href="https://twitter.com/hello_condo" target="_blank"><img
								src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/twitter.png" alt="Instagram"
								style="width: 40px; margin: 0 5px;"></a>
						<a href="https://www.reddit.com/user/HelloCondo/" target="_blank"><img
								src="https://${process.env.PRIMARY_S3_BUCKET}.s3.amazonaws.com/assets/reddit.png" alt="LinkedIn"
								style="width: 40px; margin: 0 5px;"></a>
					</div>
				</div>
			</body>
			</html>`;

  return emailHtml;
};

export { constructContactAgentEmailBody, constructContactUsEmailBody };
