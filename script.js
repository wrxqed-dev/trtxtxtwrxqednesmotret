document.addEventListener('DOMContentLoaded', () => {
    const clickIcon = document.getElementById('click-icon');
    const coinCount = document.getElementById('coin-count');
    const energyCount = document.getElementById('energy-count');
    const maxEnergy = document.getElementById('max-energy');
    const energyBarFill = document.getElementById('energy-bar-fill');
    const shopButton = document.getElementById('shop-button');
    const shopModal = document.getElementById('shop-modal');
    const closeShop = document.getElementById('close-shop');
    const upgradeClick = document.getElementById('upgrade-click');
    const upgradeEnergy = document.getElementById('upgrade-energy');
    const upgradeSpeed = document.getElementById('upgrade-speed');
    const animationContainer = document.getElementById('animation-container');
    const userName = document.getElementById('user-name');
    const tg = window.Telegram.WebApp;

    let coin = 0;
    let energy = 1000;
    let maxEnergyValue = 1000;
    let energyRegenRate = 1;
    let clickValue = 1;
    let upgradeClickCost = 50;
    let upgradeEnergyCost = 300;
    let upgradeSpeedCost = 150;

    // Set initial user name
    tg.ready(() => {
        userName.textContent = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.first_name : 'User';
    });

    function updateCoinDisplay() {
        coinCount.textContent = `${coin} TRX`;
    }

    function updateEnergyDisplay() {
        energyCount.textContent = energy;
        maxEnergy.textContent = maxEnergyValue;
        energyBarFill.style.width = `${(energy / maxEnergyValue) * 100}%`;
    }

    function regenerateEnergy() {
        if (energy < maxEnergyValue) {
            energy += energyRegenRate;
            if (energy > maxEnergyValue) energy = maxEnergyValue;
            updateEnergyDisplay();
        }
    }

    function saveProgress() {
        const progress = {
            coin,
            energy,
            maxEnergyValue,
            energyRegenRate,
            clickValue,
            upgradeClickCost,
            upgradeEnergyCost,
            upgradeSpeedCost
        };
        localStorage.setItem('clickerProgress', JSON.stringify(progress));
    }

    function loadProgress() {
        const savedProgress = JSON.parse(localStorage.getItem('clickerProgress'));
        if (savedProgress) {
            coin = savedProgress.coin;
            energy = savedProgress.energy;
            maxEnergyValue = savedProgress.maxEnergyValue;
            energyRegenRate = savedProgress.energyRegenRate;
            clickValue = savedProgress.clickValue;
            upgradeClickCost = savedProgress.upgradeClickCost;
            upgradeEnergyCost = savedProgress.upgradeEnergyCost;
            upgradeSpeedCost = savedProgress.upgradeSpeedCost;

            upgradeClick.textContent = `Upgrade Click (Cost: ${upgradeClickCost} TRX)`;
            upgradeEnergy.textContent = `Upgrade Max Energy (Cost: ${upgradeEnergyCost} TRX)`;
            upgradeSpeed.textContent = `Upgrade Energy Speed (Cost: ${upgradeSpeedCost} TRX)`;

            updateCoinDisplay();
            updateEnergyDisplay();
        }
    }

    loadProgress();

    setInterval(regenerateEnergy, 1000);

    clickIcon.addEventListener('click', () => {
        if (energy >= clickValue) {
            coin += clickValue;
            energy -= clickValue;
            updateCoinDisplay();
            updateEnergyDisplay();
            saveProgress();

            const animation = document.createElement('div');
            animation.className = 'coin-animation';
            animation.textContent = `+${clickValue} TRX`;
            animationContainer.appendChild(animation);

            setTimeout(() => {
                animationContainer.removeChild(animation);
            }, 1000);
        }
    });

    shopButton.addEventListener('click', () => {
        shopModal.style.display = 'block';
    });

    closeShop.addEventListener('click', () => {
        shopModal.style.display = 'none';
    });

    upgradeClick.addEventListener('click', () => {
        if (coin >= upgradeClickCost) {
            coin -= upgradeClickCost;
            clickValue += 1;
            upgradeClickCost *= 2;
            upgradeClick.textContent = `Upgrade Click (Cost: ${upgradeClickCost} TRX)`;
            updateCoinDisplay();
            saveProgress();
        }
    });

    upgradeEnergy.addEventListener('click', () => {
        if (coin >= upgradeEnergyCost) {
            coin -= upgradeEnergyCost;
            maxEnergyValue += 500;
            upgradeEnergyCost *= 2;
            upgradeEnergy.textContent = `Upgrade Max Energy (Cost: ${upgradeEnergyCost} TRX)`;
            updateCoinDisplay();
            updateEnergyDisplay();
            saveProgress();
        }
    });

    upgradeSpeed.addEventListener('click', () => {
        if (coin >= upgradeSpeedCost) {
            coin -= upgradeSpeedCost;
            energyRegenRate += 1;
            upgradeSpeedCost *= 2;
            upgradeSpeed.textContent = `Upgrade Energy Speed (Cost: ${upgradeSpeedCost} TRX)`;
            updateCoinDisplay();
            saveProgress();
        }
    });

    window.onclick = function(event) {
        if (event.target == shopModal) {
            shopModal.style.display = 'none';
        }
    }
});

// Генерация пальм по центру экрана
function generatePalmTrees() {
    const movingImages = document.querySelector('.moving-images');
    movingImages.innerHTML = ''; // Очищаем контейнер перед добавлением новых пальм

    for (let i = 0; i < 10; i++) {
        const palmTree = document.createElement('span');
        palmTree.textContent = '🌴';
        palmTree.className = 'moving-image';
        palmTree.style.left = `${Math.random() * 100}%`;
        palmTree.style.top = `${Math.random() * 100}%`;
        movingImages.appendChild(palmTree);
    }
}

generatePalmTrees();