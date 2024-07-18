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
        loadGameState(); // Load game state when Telegram WebApp is ready
    });

    function saveGameState() {
        const gameState = {
            coin,
            energy,
            maxEnergyValue,
            energyRegenRate,
            clickValue,
            upgradeClickCost,
            upgradeEnergyCost,
            upgradeSpeedCost
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    function loadGameState() {
        const savedGameState = localStorage.getItem('gameState');
        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);
            coin = gameState.coin;
            energy = gameState.energy;
            maxEnergyValue = gameState.maxEnergyValue;
            energyRegenRate = gameState.energyRegenRate;
            clickValue = gameState.clickValue;
            upgradeClickCost = gameState.upgradeClickCost;
            upgradeEnergyCost = gameState.upgradeEnergyCost;
            upgradeSpeedCost = gameState.upgradeSpeedCost;
            updateCoinDisplay();
            updateEnergyDisplay();
        }
    }

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

    setInterval(regenerateEnergy, 1000);

    clickIcon.addEventListener('click', () => {
        if (energy >= clickValue) {
            coin += clickValue;
            energy -= clickValue;
            updateCoinDisplay();
            updateEnergyDisplay();
            saveGameState(); // Save game state on click

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
            saveGameState(); // Save game state on upgrade
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
            saveGameState(); // Save game state on upgrade
        }
    });

    upgradeSpeed.addEventListener('click', () => {
        if (coin >= upgradeSpeedCost) {
            coin -= upgradeSpeedCost;
            energyRegenRate += 1;
            upgradeSpeedCost *= 2;
            upgradeSpeed.textContent = `Upgrade Energy Speed (Cost: ${upgradeSpeedCost} TRX)`;
            updateCoinDisplay();
            saveGameState(); // Save game state on upgrade
        }
    });

    window.onclick = function(event) {
        if (event.target == shopModal) {
            shopModal.style.display = 'none';
        }
    }
});
