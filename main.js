const topLatitude = 35.197469;
const bottomLatitude = 35.19521;
const leftLongitude = 129.213777;
const rightLongitude = 129.216863;
const latitudeValue = topLatitude - bottomLatitude;
const longitudeValue = rightLongitude - leftLongitude;

const topY = 11;
const bottomY = 63;
const leftX = 5;
const rightX = 86;

let kidLatitude = null;
let kidLongitude = null;
let kidLocX = null;
let kidLocY = null;

let kid = App.loadSpritesheet("kid.png");
let magni = App.loadSpritesheet("magni.png");

let userId = null;

App.onJoinPlayer.Add((player) => {
	player.sprite = magni;
	player.sendUpdated();

	if (player.customData) {
		userId = JSON.parse(player.customData);
		// App.sayToAll("parse clear");
		// App.sayToAll(typeof userId[0]);
	} else {
		App.sayToAll("유저ID 를 입력해주세요.");
		App.onSay.add((player, text) => {
			userId.push(text.replace(/ /g, "").split(","));
		});
	}

	if (userId)
		setInterval(() => {
			App.httpGet("https://api1.too.gold/band?type=get", null, (res) => {
				res = res.replace(/﻿/g, "");
				response = JSON.parse(res);
				Map.clearAllObjects();
				for (let i = 0; i < response.data.length; i++) {
					for (let j = 0; j < userId.length; j++) {
						if (
							response.data[i].userId &&
							response.data[i].userId == userId[j]
						) {
							kidLatitude = response.data[i].cGPS.latitude;
							kidLongitude = response.data[i].cGPS.longitude;
							// App.sayToAll(`${kidLatitude} ${kidLongitude} \n`, 0xffffff);
							kidLocY =
								topY +
								((kidLatitude - topLatitude) / latitudeValue) *
									(topY - bottomY);
							kidLocX =
								leftX +
								((kidLongitude - leftLongitude) / longitudeValue) *
									(rightX - leftX);
							// App.sayToAll(`${kidLocX} ${kidLocY} \n`, 0xffffff);
							Map.putObject(kidLocX, kidLocY, kid, { overlap: true });
						}
					}
					if (response.data[i].losted) {
						missingNotice(response.data[i].userName);
					}
				}
			});
		}, 100);
});

const missingNotice = (name) => {
	App.showCenterLabel(
		`실종 아동을 찾습니다. ${name} 어린이를 보신 분은 안내소로 신고 부탁드립니다.`
	);
	return 0;
};
