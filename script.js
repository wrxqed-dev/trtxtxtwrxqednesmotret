let coinCount = parseInt(localStorage.getItem('coinCount')) || 0;
let energyCount = parseInt(localStorage.getItem('energyCount')) || 1000;
let clickValue = parseInt(localStorage.getItem('clickValue')) || 1;
let upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 50;
let energyUpgradeCost = parseInt(localStorage.getItem('energyUpgradeCost')) || 100;

const lastEnergyUpdate = parseInt(localStorage.getItem('lastEnergyUpdate')) || Date.now();
updateEnergyOnLoad(lastEnergyUpdate);

document.getElementById('coin-count').innerText = coinCount + ' TRX';
document.getElementById('energy-count').innerText = energyCount;
document.getElementById('energy-bar-fill').style.width = (energyCount / 10) + '%';
document.getElementById('upgrade-click').innerText = `Upgrade Click (Cost: ${upgradeCost} TRX)`;
document.getElementById('upgrade-energy').innerText = `Upgrade Energy (Cost: ${energyUpgradeCost} TRX)`;

// Telegram Web App initialization
Telegram.WebApp.ready();
const tg = window.Telegram.WebApp;

function sendDataToBot(data) {
    tg.sendData(JSON.stringify(data));
}

function loadDataFromTelegram() {
    const initData = tg.initDataUnsafe;
    if (initData) {
        const user = initData.user;
        if (user) {
            document.getElementById('user-name').innerText = user.first_name + ' ' + user.last_name;
        }

        // Load user-specific data if available
        const userData = tg.initDataUnsafe.userData;
        if (userData) {
            coinCount = userData.coinCount || 0;
            energyCount = userData.energyCount || 1000;
            clickValue = userData.clickValue || 1;
            upgradeCost = userData.upgradeCost || 50;
            energyUpgradeCost = userData.energyUpgradeCost || 100;
        }
        updateDisplay();
    }
}

loadDataFromTelegram();

document.getElementById('click-icon').addEventListener('click', function() {
    if (energyCount >= clickValue) {
        coinCount += clickValue;
        energyCount -= clickValue;
        document.getElementById('coin-count').innerText = coinCount + ' TRX';
        document.getElementById('energy-count').innerText = energyCount;
        document.getElementById('energy-bar-fill').style.width = (energyCount / 10) + '%';
        localStorage.setItem('coinCount', coinCount);
        localStorage.setItem('energyCount', energyCount);
        showAnimation('+' + clickValue + ' TRX');
        saveData();
    } else {
        showAnimation('Нет энергии');
    }
});

document.getElementById('shop-button').addEventListener('click', function() {
    document.getElementById('shop-modal').style.display = "block";
});

document.getElementById('close-shop').addEventListener('click', function() {
    document.getElementById('shop-modal').style.display = "none";
});

document.getElementById('upgrade-click').addEventListener('click', function() {
    if (coinCount >= upgradeCost) {
        coinCount -= upgradeCost;
        clickValue *= 2;
        upgradeCost *= 3;
        document.getElementById('coin-count').innerText = coinCount + ' TRX';
        document.getElementById('upgrade-click').innerText = `Upgrade Click (Cost: ${upgradeCost} TRX)`;
        localStorage.setItem('coinCount', coinCount);
        localStorage.setItem('clickValue', clickValue);
        localStorage.setItem('upgradeCost', upgradeCost);
        saveData();
    } else {
        showAnimation('Недостаточно TRX');
    }
});

document.getElementById('upgrade-energy').addEventListener('click', function() {
    if (coinCount >= energyUpgradeCost) {
        coinCount -= energyUpgradeCost;
        energyCount += 500;
        if (energyCount > 1500) energyCount = 1500;
        energyUpgradeCost *= 2;
        document.getElementById('coin-count').innerText = coinCount + ' TRX';
        document.getElementById('energy-count').innerText = energyCount;
        document.getElementById('energy-bar-fill').style.width = (energyCount / 10) + '%';
        document.getElementById('upgrade-energy').innerText = `Upgrade Energy (Cost: ${energyUpgradeCost} TRX)`;
        localStorage.setItem('coinCount', coinCount);
        localStorage.setItem('energyCount', energyCount);
        localStorage.setItem('energyUpgradeCost', energyUpgradeCost);
        saveData();
    } else {
        showAnimation('Недостаточно TRX');
    }
});

function showAnimation(text) {
    const animation = document.createElement('div');
    animation.className = 'coin-animation';
    animation.innerText = text;
    document.getElementById('animation-container').appendChild(animation);
    setTimeout(() => {
        document.getElementById('animation-container').removeChild(animation);
    }, 1000);
}

function updateEnergy() {
    if (energyCount < 1000) {
        energyCount += 1;
        if (energyCount > 1000) {
            energyCount = 1000;
        }
        document.getElementById('energy-count').innerText = energyCount;
        document.getElementById('energy-bar-fill').style.width = (energyCount / 10) + '%';
        localStorage.setItem('energyCount', energyCount);
        localStorage.setItem('lastEnergyUpdate', Date.now());
        saveData();
    }
}

function updateEnergyOnLoad(lastUpdate) {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastUpdate) / 2000); // 1 энергия каждые 2 секунды
    if (elapsedSeconds > 0) {
        energyCount += elapsedSeconds;
        if (energyCount > 1000) {
            energyCount = 1000;
        }
        document.getElementById('energy-count').innerText = energyCount;
        document.getElementById('energy-bar-fill').style.width = (energyCount / 10) + '%';
        localStorage.setItem('energyCount', energyCount);
        localStorage.setItem('lastEnergyUpdate', now);
        saveData();
    }
}

function saveData() {
    const data = {
        coinCount,
        energyCount,
        clickValue,
        upgradeCost,
        energyUpgradeCost
    };
    sendDataToBot(data);
}

setInterval(updateEnergy, 2000);
