let coinCount = parseInt(localStorage.getItem('coinCount')) || 0;
let energyCount = parseInt(localStorage.getItem('energyCount')) || 1000;
let maxEnergy = parseInt(localStorage.getItem('maxEnergy')) || 1000;
let clickValue = parseInt(localStorage.getItem('clickValue')) || 1;
let upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 50;
let energyUpgradeCost = parseInt(localStorage.getItem('energyUpgradeCost')) || 300;
let energySpeedUpgradeCost = parseInt(localStorage.getItem('energySpeedUpgradeCost')) || 150;
let energyRegenSpeed = parseInt(localStorage.getItem('energyRegenSpeed')) || 1;

const lastEnergyUpdate = parseInt(localStorage.getItem('lastEnergyUpdate')) || Date.now();
updateEnergyOnLoad(lastEnergyUpdate);

document.getElementById('coin-count').innerText = coinCount + ' TRX';
document.getElementById('energy-count').innerText = energyCount;
document.getElementById('max-energy').innerText = maxEnergy;
document.getElementById('energy-bar-fill').style.width = (energyCount / maxEnergy) * 100 + '%';
document.getElementById('upgrade-click').innerText = `Upgrade Click (Cost: ${upgradeCost} TRX)`;
document.getElementById('upgrade-energy').innerText = `Upgrade Max Energy (Cost: ${energyUpgradeCost} TRX)`;
document.getElementById('upgrade-speed').innerText = `Upgrade Energy Speed (Cost: ${energySpeedUpgradeCost} TRX)`;

// Ensure Telegram Web App is loaded before accessing its properties
Telegram.WebApp.ready();

function loadDataFromTelegram() {
    const tg = window.Telegram.WebApp;
    tg.expand();
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        if (user) {
            document.getElementById('user-name').innerText = user.first_name + ' ' + (user.last_name || '');
        }

        // Load user-specific data if available
        const userData = tg.initDataUnsafe;
        if (userData.coinCount !== undefined) {
            coinCount = userData.coinCount;
        }
        if (userData.energyCount !== undefined) {
            energyCount = userData.energyCount;
        }
        if (userData.maxEnergy !== undefined) {
            maxEnergy = userData.maxEnergy;
        }
        if (userData.clickValue !== undefined) {
            clickValue = userData.clickValue;
        }
        if (userData.upgradeCost !== undefined) {
            upgradeCost = userData.upgradeCost;
        }
        if (userData.energyUpgradeCost !== undefined) {
            energyUpgradeCost = userData.energyUpgradeCost;
        }
        if (userData.energySpeedUpgradeCost !== undefined) {
            energySpeedUpgradeCost = userData.energySpeedUpgradeCost;
        }
        if (userData.energyRegenSpeed !== undefined) {
            energyRegenSpeed = userData.energyRegenSpeed;
        }
    }
}

loadDataFromTelegram();

document.getElementById('click-icon').addEventListener('click', function() {
    if (energyCount >= clickValue) {
        coinCount += clickValue;
        energyCount -= clickValue;
        document.getElementById('coin-count').innerText = coinCount + ' TRX';
        document.getElementById('energy-count').innerText = energyCount;
        document.getElementById('energy-bar-fill').style.width = (energyCount / maxEnergy) * 100 + '%';
        localStorage.setItem('coinCount', coinCount);
        localStorage.setItem('energyCount', energyCount);
        showAnimation('+' + clickValue + ' TRX');
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
    } else {
        showAnimation('Недостаточно TRX');
    }
});

document.getElementById('upgrade-energy').addEventListener('click', function() {
    if (coinCount >= energyUpgradeCost) {
        coinCount -= energyUpgradeCost;
        maxEnergy += 500;
        energyUpgradeCost *= 2;
        document.getElementById('coin-count').innerText = coinCount + ' TRX';
        document.getElementById('max-energy').innerText = maxEnergy;
        document.getElementById('energy-bar-fill').style.width = (energyCount / maxEnergy) * 100 + '%';
        document.getElementById('upgrade-energy').innerText = `Upgrade Max Energy (Cost: ${energyUpgradeCost} TRX)`;
        localStorage.setItem('coinCount', coinCount);
        localStorage.setItem('maxEnergy', maxEnergy);
        localStorage.setItem('energyUpgradeCost', energyUpgradeCost);
    } else {
        showAnimation('Недостаточно TRX');
    }
});

document.getElementById('upgrade-speed').addEventListener('click', function() {
    if (coinCount >= energySpeedUpgradeCost) {
        coinCount -= energySpeedUpgradeCost;
        energyRegenSpeed += 1;
        energySpeedUpgradeCost *= 2;
        document.getElementById('coin-count').innerText = coinCount + ' TRX';
        document.getElementById('upgrade-speed').innerText = `Upgrade Energy Speed (Cost: ${energySpeedUpgradeCost} TRX)`;
        localStorage.setItem('coinCount', coinCount);
        localStorage.setItem('energyRegenSpeed', energyRegenSpeed);
        localStorage.setItem('energySpeedUpgradeCost', energySpeedUpgradeCost);
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
    if (energyCount < maxEnergy) {
        energyCount += energyRegenSpeed;
        if (energyCount > maxEnergy) {
            energyCount = maxEnergy;
        }
        document.getElementById('energy-count').innerText = energyCount;
        document.getElementById('energy-bar-fill').style.width = (energyCount / maxEnergy) * 100 + '%';
        localStorage.setItem('energyCount', energyCount);
        localStorage.setItem('lastEnergyUpdate', Date.now());
    }
}

function updateEnergyOnLoad(lastUpdate) {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastUpdate) / 2000); // 1 энергия каждые 2 секунды
    const energyGained = elapsedSeconds * energyRegenSpeed;
    if (energyGained > 0) {
        energyCount += energyGained;
        if (energyCount > maxEnergy) {
            energyCount = maxEnergy;
        }
        document.getElementById('energy-count').innerText = energyCount;
        document.getElementById('energy-bar-fill').style.width = (energyCount / maxEnergy) * 100 + '%';
        localStorage.setItem('energyCount', energyCount);
        localStorage.setItem('lastEnergyUpdate', now);
    }
}

setInterval(updateEnergy, 2000);
