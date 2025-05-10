# Simulation of China's Open-Economy Growth Model (1980-2025)

**Assumptions for Default Player Choices:**

- **Exchange Rate Policy ($x_t$):** $x_t = 1.0$ (market value)
- **Saving Rate ($s_t$):** $s_t = 0.20$ (20%)

**Parameters and Initial Values:**

- **Parameters:**
  - $\alpha = 0.30$ (Capital share in production)
  - $\delta = 0.10$ (Depreciation rate)
  - $g = 0.005$ (Baseline TFP growth rate)
  - $n = 0.00717$ (Labor-force growth rate)
  - $\theta = 0.1453$ (Openness contribution to TFP growth)
  - $\phi = 0.10$ (FDI contribution to TFP growth)
  - $\varepsilon_x = 1.5$ (Exchange-rate elasticity for exports)
  - $\varepsilon_m = 1.2$ (Exchange-rate elasticity for imports)
  - $\mu_x = 1.0$ (Income elasticity for exports)
  - $\mu_m = 1.0$ (Income elasticity for imports)
- **Initial State Variables (for $t=0$, Year 1980):**
  - $K_0 = K_{1980} = 2050.10$ bn USD
  - $L_0 = L_{1980} = 428.30$ million
  - $A_0 = A_{1980} = 0.203$ index
- **Base Values for Trade Equations (from $t=0$, Year 1980):**
  - $X_0^{param} = 18.10$ bn USD (Parameter $X_0$)
  - $M_0^{param} = 14.50$ bn USD (Parameter $M_0$)
  - $Y_{1980}^{base} = 191.15$ bn USD
  - $e_{1980}^{base} = 0.78$ CNY per USD
  - $Y^*_{1980}^{base} = 1000.00$ (index)

---

## Round 0: Year 1980

_(Computes current variables for 1980 and state variables for 1985)_

**Inputs for Year 1980 ($t=0$):**

- Player Controls: $x_{1980} = 1.0$, $s_{1980} = 0.20$
- Exogenous Variables:
  - $\tilde e_{1980} = 0.78$
  - $fdi\_ratio_{1980} = 0.001$
  - $Y^*_{1980} = 1000.00$
  - $H_{1980} = 1.58$
- State Variables:
  - $K_{1980} = 2050.10$
  - $L_{1980} = 428.30$
  - $A_{1980} = 0.203$

**Computation Steps for Year 1980 ($t=0$):**

1.  **Output/Production ($Y_{1980}$):**

    - Formula: $Y_t = A_t K_t^{\alpha} (L_t H_t)^{1-\alpha}$
    - Plug-in: $Y_{1980} = 0.203 \times (2050.10)^{0.30} \times (428.30 \times 1.58)^{0.70}$
    - Result: $Y_{1980} \approx 191.15$ bn USD

2.  **Nominal Exchange Rate ($e_{1980}$):**

    - Formula: $e_t = x_t \tilde e_t$
    - Plug-in: $e_{1980} = 1.0 \times 0.78$
    - Result: $e_{1980} = 0.78$ CNY per USD

3.  **Exports ($X_{1980}$):**

    - Formula: $X_t = X_0^{param} (\frac{e_t}{e_{1980}^{base}})^{\varepsilon_x} (\frac{Y^*_t}{Y^*_{1980}^{base}})^{\mu_x}$
    - Plug-in: $X_{1980} = 18.10 \times (\frac{0.78}{0.78})^{1.5} \times (\frac{1000.00}{1000.00})^{1.0}$
    - Result: $X_{1980} = 18.10$ bn USD

4.  **Imports ($M_{1980}$):**

    - Formula: $M_t = M_0^{param} (\frac{e_t}{e_{1980}^{base}})^{-\varepsilon_m} (\frac{Y_t}{Y_{1980}^{base}})^{\mu_m}$
    - Plug-in: $M_{1980} = 14.50 \times (\frac{0.78}{0.78})^{-1.2} \times (\frac{191.15}{191.15})^{1.0}$
    - Result: $M_{1980} = 14.50$ bn USD

5.  **Net Exports ($NX_{1980}$):**

    - Formula: $NX_t = X_t - M_t$
    - Plug-in: $NX_{1980} = 18.10 - 14.50$
    - Result: $NX_{1980} = 3.60$ bn USD

6.  **Openness Ratio ($openness_{1980}$):**

    - Formula: $openness_t = \frac{X_t + M_t}{Y_t}$
    - Plug-in: $openness_{1980} = \frac{18.10 + 14.50}{191.15}$
    - Result: $openness_{1980} \approx 0.1705$

7.  **Consumption ($C_{1980}$):**

    - Formula: $C_t = (1-s_t) Y_t$
    - Plug-in: $C_{1980} = (1-0.20) \times 191.15$
    - Result: $C_{1980} = 152.92$ bn USD

8.  **Investment ($I_{1980}$):**
    - Formula: $I_t = s_t Y_t - NX_t$
    - Plug-in: $I_{1980} = (0.20 \times 191.15) - 3.60$
    - Result: $I_{1980} = 34.63$ bn USD

**Next Period's State Variables (for Year 1985, $t=1$):**

- **Labor Force ($L_{1985}$):**

  - Formula: $L_{t+1} = (1+n) L_t$
  - Plug-in: $L_{1985} = (1+0.00717) \times 428.30$
  - Result: $L_{1985} \approx 431.37$ million

- **Capital Stock ($K_{1985}$):**

  - Formula: $K_{t+1} = (1-\delta) K_t + I_t$
  - Plug-in: $K_{1985} = (1-0.10) \times 2050.10 + 34.63$
  - Result: $K_{1985} \approx 1879.72$ bn USD

- **TFP ($A_{1985}$):**
  - Formula: $A_{t+1} = A_t (1 + g + \theta \cdot openness_t + \phi \cdot fdi\_ratio_t)$
  - Plug-in: $A_{1985} = 0.203 \times (1 + 0.005 + 0.1453 \times 0.1705 + 0.10 \times 0.001)$
  - Result: $A_{1985} \approx 0.20906$

---

## Round 1: Year 1985

_(Computes current variables for 1985 and state variables for 1990)_

**Inputs for Year 1985 ($t=1$):**

- Player Controls: $x_{1985} = 1.0$, $s_{1985} = 0.20$
- Exogenous Variables:
  - $\tilde e_{1985} = 1.53$
  - $fdi\_ratio_{1985} = 0.001$
  - $Y^*_{1985} = 1159.27$
  - $H_{1985} = 1.77$
- State Variables (from end of Round 0):
  - $K_{1985} \approx 1879.72$
  - $L_{1985} \approx 431.37$
  - $A_{1985} \approx 0.20906$

**Computation Steps for Year 1985 ($t=1$):**

1.  **Output/Production ($Y_{1985}$):**

    - Formula: $Y_t = A_t K_t^{\alpha} (L_t H_t)^{1-\alpha}$
    - Plug-in: $Y_{1985} = 0.20906 \times (1879.72)^{0.30} \times (431.37 \times 1.77)^{0.70}$
    - Result: $Y_{1985} \approx 208.32$ bn USD

2.  **Nominal Exchange Rate ($e_{1985}$):**

    - Formula: $e_t = x_t \tilde e_t$
    - Plug-in: $e_{1985} = 1.0 \times 1.53$
    - Result: $e_{1985} = 1.53$ CNY per USD

3.  **Exports ($X_{1985}$):**

    - Formula: $X_t = X_0^{param} (\frac{e_t}{e_{1980}^{base}})^{\varepsilon_x} (\frac{Y^*_t}{Y^*_{1980}^{base}})^{\mu_x}$
    - Plug-in: $X_{1985} = 18.10 \times (\frac{1.53}{0.78})^{1.5} \times (\frac{1159.27}{1000.00})^{1.0}$
    - Result: $X_{1985} \approx 57.50$ bn USD

4.  **Imports ($M_{1985}$):**

    - Formula: $M_t = M_0^{param} (\frac{e_t}{e_{1980}^{base}})^{-\varepsilon_m} (\frac{Y_t}{Y_{1980}^{base}})^{\mu_m}$
    - Plug-in: $M_{1985} = 14.50 \times (\frac{1.53}{0.78})^{-1.2} \times (\frac{208.32}{191.15})^{1.0}$
    - Result: $M_{1985} \approx 6.93$ bn USD

5.  **Net Exports ($NX_{1985}$):**

    - Formula: $NX_t = X_t - M_t$
    - Plug-in: $NX_{1985} = 57.50 - 6.93$
    - Result: $NX_{1985} = 50.57$ bn USD

6.  **Openness Ratio ($openness_{1985}$):**

    - Formula: $openness_t = \frac{X_t + M_t}{Y_t}$
    - Plug-in: $openness_{1985} = \frac{57.50 + 6.93}{208.32}$
    - Result: $openness_{1985} \approx 0.3093$

7.  **Consumption ($C_{1985}$):**

    - Formula: $C_t = (1-s_t) Y_t$
    - Plug-in: $C_{1985} = (1-0.20) \times 208.32$
    - Result: $C_{1985} = 166.66$ bn USD

8.  **Investment ($I_{1985}$):**
    - Formula: $I_t = s_t Y_t - NX_t$
    - Plug-in: $I_{1985} = (0.20 \times 208.32) - 50.57$
    - Result: $I_{1985} \approx -8.91$ bn USD

**Next Period's State Variables (for Year 1990, $t=2$):**

- **Labor Force ($L_{1990}$):**

  - Formula: $L_{t+1} = (1+n) L_t$
  - Plug-in: $L_{1990} = (1+0.00717) \times 431.37$
  - Result: $L_{1990} \approx 434.46$ million

- **Capital Stock ($K_{1990}$):**

  - Formula: $K_{t+1} = (1-\delta) K_t + I_t$
  - Plug-in: $K_{1990} = (1-0.10) \times 1879.72 + (-8.906)$
  - Result: $K_{1990} \approx 1682.84$ bn USD

- **TFP ($A_{1990}$):**
  - Formula: $A_{t+1} = A_t (1 + g + \theta \cdot openness_t + \phi \cdot fdi\_ratio_t)$
  - Plug-in: $A_{1990} = 0.20906 \times (1 + 0.005 + 0.1453 \times 0.3093 + 0.10 \times 0.001)$
  - Result: $A_{1990} \approx 0.21952$

---

## Round 2: Year 1990

_(Computes current variables for 1990 and state variables for 1995)_

**Inputs for Year 1990 ($t=2$):**

- Player Controls: $x_{1990} = 1.0$, $s_{1990} = 0.20$
- Exogenous Variables (from table for 1990):
  - $\tilde e_{1990} = 2.48$
  - $fdi\_ratio_{1990} = 0.02$
  - $Y^*_{1990} = 1343.92$
  - $H_{1990} = 1.80$
- State Variables (from end of Round 1):
  - $K_{1990} \approx 1682.84$ bn USD
  - $L_{1990} \approx 434.46$ million
  - $A_{1990} \approx 0.21952$

**Computation Steps for Year 1990 ($t=2$):**

1.  **Output/Production ($Y_{1990}$):**

    - Formula: $Y_t = A_t K_t^{\alpha} (L_t H_t)^{1-\alpha}$
    - Plug-in: $Y_{1990} = 0.21952 \times (1682.84)^{0.30} \times (434.46 \times 1.80)^{0.70}$
    - Result: $Y_{1990} \approx 216.31$ bn USD

2.  **Nominal Exchange Rate ($e_{1990}$):**

    - Formula: $e_t = x_t \tilde e_t$
    - Plug-in: $e_{1990} = 1.0 \times 2.48$
    - Result: $e_{1990} = 2.48$ CNY per USD

3.  **Exports ($X_{1990}$):**

    - Formula: $X_t = X_0^{param} (\frac{e_t}{e_{1980}^{base}})^{\varepsilon_x} (\frac{Y^*_t}{Y^*_{1980}^{base}})^{\mu_x}$
    - Plug-in: $X_{1990} = 18.10 \times (\frac{2.48}{0.78})^{1.5} \times (\frac{1343.92}{1000.00})^{1.0}$
    - Result: $X_{1990} \approx 138.01$ bn USD

4.  **Imports ($M_{1990}$):**

    - Formula: $M_t = M_0^{param} (\frac{e_t}{e_{1980}^{base}})^{-\varepsilon_m} (\frac{Y_t}{Y_{1980}^{base}})^{\mu_m}$
    - Plug-in: $M_{1990} = 14.50 \times (\frac{2.48}{0.78})^{-1.2} \times (\frac{216.31}{191.15})^{1.0}$
    - Result: $M_{1990} \approx 4.27$ bn USD

5.  **Net Exports ($NX_{1990}$):**

    - Formula: $NX_t = X_t - M_t$
    - Plug-in: $NX_{1990} = 138.01 - 4.27$
    - Result: $NX_{1990} = 133.74$ bn USD

6.  **Openness Ratio ($openness_{1990}$):**

    - Formula: $openness_t = \frac{X_t + M_t}{Y_t}$
    - Plug-in: $openness_{1990} = \frac{138.01 + 4.27}{216.31}$
    - Result: $openness_{1990} \approx 0.6578$

7.  **Consumption ($C_{1990}$):**

    - Formula: $C_t = (1-s_t) Y_t$
    - Plug-in: $C_{1990} = (1-0.20) \times 216.31$
    - Result: $C_{1990} = 173.05$ bn USD

8.  **Investment ($I_{1990}$):**
    - Formula: $I_t = s_t Y_t - NX_t$
    - Plug-in: $I_{1990} = (0.20 \times 216.31) - 133.74$
    - Result: $I_{1990} = -90.478$ bn USD

**Next Period's State Variables (for Year 1995, $t=3$):**

- **Labor Force ($L_{1995}$):**

  - Formula: $L_{t+1} = (1+n) L_t$
  - Plug-in: $L_{1995} = (1+0.00717) \times 434.46$
  - Result: $L_{1995} \approx 437.58$ million

- **Capital Stock ($K_{1995}$):**

  - Formula: $K_{t+1} = (1-\delta) K_t + I_t$
  - Plug-in: $K_{1995} = (1-0.10) \times 1682.84 + (-90.478)$
  - Result: $K_{1995} \approx 1424.08$ bn USD

- **TFP ($A_{1995}$):**
  - Formula: $A_{t+1} = A_t (1 + g + \theta \cdot openness_t + \phi \cdot fdi\_ratio_t)$
  - Plug-in: $A_{1995} = 0.21952 \times (1 + 0.005 + 0.1453 \times 0.6578 + 0.10 \times 0.02)$
  - Result: $A_{1995} \approx 0.24204$

---

## Round 3: Year 1995

_(Computes current variables for 1995 and state variables for 2000)_

**Inputs for Year 1995 ($t=3$):**

- Player Controls: $x_{1995} = 1.0$, $s_{1995} = 0.20$
- Exogenous Variables (from table for 1995):
  - $\tilde e_{1995} = 4.34$
  - $fdi\_ratio_{1995} = 0.02$
  - $Y^*_{1995} = 1557.97$
  - $H_{1995} = 2.02$
- State Variables (from end of Round 2):
  - $K_{1995} \approx 1424.08$ bn USD
  - $L_{1995} \approx 437.58$ million
  - $A_{1995} \approx 0.24204$

**Computation Steps for Year 1995 ($t=3$):**

1.  **Output/Production ($Y_{1995}$):**

    - Formula: $Y_t = A_t K_t^{\alpha} (L_t H_t)^{1-\alpha}$
    - Plug-in: $Y_{1995} = 0.24204 \times (1424.08)^{0.30} \times (437.58 \times 2.02)^{0.70}$
    - Result: $Y_{1995} \approx 257.83$ bn USD

2.  **Nominal Exchange Rate ($e_{1995}$):**

    - Formula: $e_t = x_t \tilde e_t$
    - Plug-in: $e_{1995} = 1.0 \times 4.34$
    - Result: $e_{1995} = 4.34$ CNY per USD

3.  **Exports ($X_{1995}$):**

    - Formula: $X_t = X_0^{param} (\frac{e_t}{e_{1980}^{base}})^{\varepsilon_x} (\frac{Y^*_t}{Y^*_{1980}^{base}})^{\mu_x}$
    - Plug-in: $X_{1995} = 18.10 \times (\frac{4.34}{0.78})^{1.5} \times (\frac{1557.97}{1000.00})^{1.0}$
    - Result: $X_{1995} \approx 370.62$ bn USD

4.  **Imports ($M_{1995}$):**

    - Formula: $M_t = M_0^{param} (\frac{e_t}{e_{1980}^{base}})^{-\varepsilon_m} (\frac{Y_t}{Y_{1980}^{base}})^{\mu_m}$
    - Plug-in: $M_{1995} = 14.50 \times (\frac{4.34}{0.78})^{-1.2} \times (\frac{257.83}{191.15})^{1.0}$
    - Result: $M_{1995} \approx 2.49$ bn USD

5.  **Net Exports ($NX_{1995}$):**

    - Formula: $NX_t = X_t - M_t$
    - Plug-in: $NX_{1995} = 370.62 - 2.49$
    - Result: $NX_{1995} = 368.13$ bn USD

6.  **Openness Ratio ($openness_{1995}$):**

    - Formula: $openness_t = \frac{X_t + M_t}{Y_t}$
    - Plug-in: $openness_{1995} = \frac{370.62 + 2.49}{257.83}$
    - Result: $openness_{1995} \approx 1.4471$

7.  **Consumption ($C_{1995}$):**

    - Formula: $C_t = (1-s_t) Y_t$
    - Plug-in: $C_{1995} = (1-0.20) \times 257.83$
    - Result: $C_{1995} = 206.26$ bn USD

8.  **Investment ($I_{1995}$):**
    - Formula: $I_t = s_t Y_t - NX_t$
    - Plug-in: $I_{1995} = (0.20 \times 257.83) - 368.13$
    - Result: $I_{1995} = -316.564$ bn USD

**Next Period's State Variables (for Year 2000, $t=4$):**

- **Labor Force ($L_{2000}$):**

  - Formula: $L_{t+1} = (1+n) L_t$
  - Plug-in: $L_{2000} = (1+0.00717) \times 437.58$
  - Result: $L_{2000} \approx 440.72$ million

- **Capital Stock ($K_{2000}$):**

  - Formula: $K_{t+1} = (1-\delta) K_t + I_t$
  - Plug-in: $K_{2000} = (1-0.10) \times 1424.08 + (-316.564)$
  - Result: $K_{2000} \approx 965.11$ bn USD

- **TFP ($A_{2000}$):**
  - Formula: $A_{t+1} = A_t (1 + g + \theta \cdot openness_t + \phi \cdot fdi\_ratio_t)$
  - Plug-in: $A_{2000} = 0.24204 \times (1 + 0.005 + 0.1453 \times 1.4471 + 0.10 \times 0.02)$
  - Result: $A_{2000} \approx 0.29469$

---

## Round 4: Year 2000

_(Computes current variables for 2000 and state variables for 2005)_

**Inputs for Year 2000 ($t=4$):**

- Player Controls: $x_{2000} = 1.0$, $s_{2000} = 0.20$
- Exogenous Variables (from table for 2000):
  - $\tilde e_{2000} = 5.23$
  - $fdi\_ratio_{2000} = 0.02$
  - $Y^*_{2000} = 1806.11$
  - $H_{2000} = 2.24$
- State Variables (from end of Round 3):
  - $K_{2000} \approx 965.11$ bn USD
  - $L_{2000} \approx 440.72$ million
  - $A_{2000} \approx 0.29469$

**Computation Steps for Year 2000 ($t=4$):**

1.  **Output/Production ($Y_{2000}$):**

    - Formula: $Y_t = A_t K_t^{\alpha} (L_t H_t)^{1-\alpha}$
    - Plug-in: $Y_{2000} = 0.29469 \times (965.11)^{0.30} \times (440.72 \times 2.24)^{0.70}$
    - Result: $Y_{2000} \approx 309.66$ bn USD

2.  **Nominal Exchange Rate ($e_{2000}$):**

    - Formula: $e_t = x_t \tilde e_t$
    - Plug-in: $e_{2000} = 1.0 \times 5.23$
    - Result: $e_{2000} = 5.23$ CNY per USD

3.  **Exports ($X_{2000}$):**

    - Formula: $X_t = X_0^{param} (\frac{e_t}{e_{1980}^{base}})^{\varepsilon_x} (\frac{Y^*_t}{Y^*_{1980}^{base}})^{\mu_x}$
    - Plug-in: $X_{2000} = 18.10 \times (\frac{5.23}{0.78})^{1.5} \times (\frac{1806.11}{1000.00})^{1.0}$
    - Result: $X_{2000} \approx 567.84$ bn USD

4.  **Imports ($M_{2000}$):**

    - Formula: $M_t = M_0^{param} (\frac{e_t}{e_{1980}^{base}})^{-\varepsilon_m} (\frac{Y_t}{Y_{1980}^{base}})^{\mu_m}$
    - Plug-in: $M_{2000} = 14.50 \times (\frac{5.23}{0.78})^{-1.2} \times (\frac{309.66}{191.15})^{1.0}$
    - Result: $M_{2000} \approx 2.26$ bn USD

5.  **Net Exports ($NX_{2000}$):**

    - Formula: $NX_t = X_t - M_t$
    - Plug-in: $NX_{2000} = 567.84 - 2.26$
    - Result: $NX_{2000} = 565.58$ bn USD

6.  **Openness Ratio ($openness_{2000}$):**

    - Formula: $openness_t = \frac{X_t + M_t}{Y_t}$
    - Plug-in: $openness_{2000} = \frac{567.84 + 2.26}{309.66}$
    - Result: $openness_{2000} \approx 1.8407$

7.  **Consumption ($C_{2000}$):**

    - Formula: $C_t = (1-s_t) Y_t$
    - Plug-in: $C_{2000} = (1-0.20) \times 309.66$
    - Result: $C_{2000} = 247.73$ bn USD

8.  **Investment ($I_{2000}$):**
    - Formula: $I_t = s_t Y_t - NX_t$
    - Plug-in: $I_{2000} = (0.20 \times 309.66) - 565.58$
    - Result: $I_{2000} = -503.648$ bn USD

**Next Period's State Variables (for Year 2005, $t=5$):**

- **Labor Force ($L_{2005}$):**

  - Formula: $L_{t+1} = (1+n) L_t$
  - Plug-in: $L_{2005} = (1+0.00717) \times 440.72$
  - Result: $L_{2005} \approx 443.88$ million

- **Capital Stock ($K_{2005}$):**

  - Formula: $K_{t+1} = (1-\delta) K_t + I_t$
  - Plug-in: $K_{2005} = (1-0.10) \times 965.11 + (-503.648)$
  - Result: $K_{2005} \approx 364.95$ bn USD

- **TFP ($A_{2005}$):**
  - Formula: $A_{t+1} = A_t (1 + g + \theta \cdot openness_t + \phi \cdot fdi\_ratio_t)$
  - Plug-in: $A_{2005} = 0.29469 \times (1 + 0.005 + 0.1453 \times 1.8407 + 0.10 \times 0.02)$
  - Result: $A_{2005} \approx 0.37559$

---

## Round 5: Year 2005

_(Computes current variables for 2005 and state variables for 2010)_

**Inputs for Year 2005 ($t=5$):**

- Player Controls: $x_{2005} = 1.0$, $s_{2005} = 0.20$
- Exogenous Variables (from table for 2005):
  - $\tilde e_{2005} = 4.75$
  - $fdi\_ratio_{2005} = 0.02$
  - $Y^*_{2005} = 2093.78$
  - $H_{2005} = 2.43$
- State Variables (from end of Round 4):
  - $K_{2005} \approx 364.95$ bn USD
  - $L_{2005} \approx 443.88$ million
  - $A_{2005} \approx 0.37559$

**Computation Steps for Year 2005 ($t=5$):**

1.  **Output/Production ($Y_{2005}$):**

    - Formula: $Y_t = A_t K_t^{\alpha} (L_t H_t)^{1-\alpha}$
    - Plug-in: $Y_{2005} = 0.37559 \times (364.95)^{0.30} \times (443.88 \times 2.43)^{0.70}$
    - Result: $Y_{2005} \approx 312.00$ bn USD

2.  **Nominal Exchange Rate ($e_{2005}$):**

    - Formula: $e_t = x_t \tilde e_t$
    - Plug-in: $e_{2005} = 1.0 \times 4.75$
    - Result: $e_{2005} = 4.75$ CNY per USD

3.  **Exports ($X_{2005}$):**

    - Formula: $X_t = X_0^{param} (\frac{e_t}{e_{1980}^{base}})^{\varepsilon_x} (\frac{Y^*_t}{Y^*_{1980}^{base}})^{\mu_x}$
    - Plug-in: $X_{2005} = 18.10 \times (\frac{4.75}{0.78})^{1.5} \times (\frac{2093.78}{1000.00})^{1.0}$
    - Result: $X_{2005} \approx 568.48$ bn USD

4.  **Imports ($M_{2005}$):**

    - Formula: $M_t = M_0^{param} (\frac{e_t}{e_{1980}^{base}})^{-\varepsilon_m} (\frac{Y_t}{Y_{1980}^{base}})^{\mu_m}$
    - Plug-in: $M_{2005} = 14.50 \times (\frac{4.75}{0.78})^{-1.2} \times (\frac{312.00}{191.15})^{1.0}$
    - Result: $M_{2005} \approx 2.69$ bn USD

5.  **Net Exports ($NX_{2005}$):**

    - Formula: $NX_t = X_t - M_t$
    - Plug-in: $NX_{2005} = 568.48 - 2.69$
    - Result: $NX_{2005} = 565.79$ bn USD

6.  **Openness Ratio ($openness_{2005}$):**

    - Formula: $openness_t = \frac{X_t + M_t}{Y_t}$
    - Plug-in: $openness_{2005} = \frac{568.48 + 2.69}{312.00}$
    - Result: $openness_{2005} \approx 1.8307$

7.  **Consumption ($C_{2005}$):**

    - Formula: $C_t = (1-s_t) Y_t$
    - Plug-in: $C_{2005} = (1-0.20) \times 312.00$
    - Result: $C_{2005} = 249.60$ bn USD

8.  **Investment ($I_{2005}$):**
    - Formula: $I_t = s_t Y_t - NX_t$
    - Plug-in: $I_{2005} = (0.20 \times 312.00) - 565.79$
    - Result: $I_{2005} = -503.39$ bn USD

**Next Period's State Variables (for Year 2010, $t=6$):**

- **Labor Force ($L_{2010}$):**

  - Formula: $L_{t+1} = (1+n) L_t$
  - Plug-in: $L_{2010} = (1+0.00717) \times 443.88$
  - Result: $L_{2010} \approx 447.07$ million

- **Capital Stock ($K_{2010}$):**

  - Formula: $K_{t+1} = (1-\delta) K_t + I_t$
  - Plug-in: $K_{2010} = (1-0.10) \times 364.95 + (-503.39)$
  - Result: $K_{2010} \approx -174.94$ bn USD

- **TFP ($A_{2010}$):**
  - Formula: $A_{t+1} = A_t (1 + g + \theta \cdot openness_t + \phi \cdot fdi\_ratio_t)$
  - Plug-in: $A_{2010} = 0.37559 \times (1 + 0.005 + 0.1453 \times 1.8307 + 0.10 \times 0.02)$
  - Result: $A_{2010} \approx 0.47812$

---

**Important Note on Negative Capital Stock:**
As seen above, the capital stock $K_{2010}$ has become negative. In a real economic model, this would be an impossible scenario. It arises here because the player's chosen saving rate ($s_t=0.20$) combined with very high net exports (driven by the exchange rate and foreign income dynamics) results in consistently negative investment ($I_t = s_t Y_t - NX_t$). When investment is negative and large enough, it can deplete the existing capital stock (after accounting for depreciation) to below zero.

For the purpose of this simulation, I will continue the calculations. However, in a practical application or game, this would typically trigger error conditions, require adjustments to assumptions, or player choices would lead to different outcomes. The production function $Y_t = A_t K_t^{\alpha} (L_t H_t)^{1-\alpha}$ is not well-defined for $K_t < 0$ if $\alpha$ is not an integer (here $\alpha=0.3$). The calculation $K_t^\alpha$ would yield a complex number or be undefined.

To proceed, I will assume $K_t^\alpha = 0$ if $K_t \le 0$, which would make $Y_t=0$. This will then propagate through the rest of the calculations.

---

## Round 6: Year 2010

_(Computes current variables for 2010 and state variables for 2015)_

**Inputs for Year 2010 ($t=6$):**

- Player Controls: $x_{2010} = 1.0$, $s_{2010} = 0.20$
- Exogenous Variables (from table for 2010):
  - $\tilde e_{2010} = 5.61$
  - $fdi\_ratio_{2010} = 0.02$
  - $Y^*_{2010} = 2427.26$
  - $H_{2010} = 2.61$
- State Variables (from end of Round 5):
  - $K_{2010} \approx -174.94$ bn USD (Problematic, will lead to $Y_{2010}=0$)
  - $L_{2010} \approx 447.07$ million
  - $A_{2010} \approx 0.47812$

**Computation Steps for Year 2010 ($t=6$):**

1.  **Output/Production ($Y_{2010}$):**

    - Formula: $Y_t = A_t K_t^{\alpha} (L_t H_t)^{1-\alpha}$
    - Since $K_{2010} \le 0$, we set $K_{2010}^{\alpha} = 0$.
    - Plug-in: $Y_{2010} = A_{2010} \times 0 \times (L_{2010} H_{2010})^{1-\alpha}$
    - Result: $Y_{2010} = 0$ bn USD

2.  **Nominal Exchange Rate ($e_{2010}$):**

    - Formula: $e_t = x_t \tilde e_t$
    - Plug-in: $e_{2010} = 1.0 \times 5.61$
    - Result: $e_{2010} = 5.61$ CNY per USD

3.  **Exports ($X_{2010}$):**

    - Formula: $X_t = X_0^{param} (\frac{e_t}{e_{1980}^{base}})^{\varepsilon_x} (\frac{Y^*_t}{Y^*_{1980}^{base}})^{\mu_x}$
    - Plug-in: $X_{2010} = 18.10 \times (\frac{5.61}{0.78})^{1.5} \times (\frac{2427.26}{1000.00})^{1.0}$
    - Result: $X_{2010} \approx 847.58$ bn USD

4.  **Imports ($M_{2010}$):**

    - Formula: $M_t = M_0^{param} (\frac{e_t}{e_{1980}^{base}})^{-\varepsilon_m} (\frac{Y_t}{Y_{1980}^{base}})^{\mu_m}$
    - Plug-in: $M_{2010} = 14.50 \times (\frac{5.61}{0.78})^{-1.2} \times (\frac{0}{191.15})^{1.0}$
    - Result: $M_{2010} = 0$ bn USD

5.  **Net Exports ($NX_{2010}$):**

    - Formula: $NX_t = X_t - M_t$
    - Plug-in: $NX_{2010} = 847.58 - 0$
    - Result: $NX_{2010} = 847.58$ bn USD

6.  **Openness Ratio ($openness_{2010}$):**

    - Formula: $openness_t = \frac{X_t + M_t}{Y_t}$
    - Result: $openness_{2010} = 0$ (by convention for $Y_t=0$)

7.  **Consumption ($C_{2010}$):**

    - Formula: $C_t = (1-s_t) Y_t$
    - Plug-in: $C_{2010} = (1-0.20) \times 0$
    - Result: $C_{2010} = 0$ bn USD

8.  **Investment ($I_{2010}$):**
    - Formula: $I_t = s_t Y_t - NX_t$
    - Plug-in: $I_{2010} = (0.20 \times 0) - 847.58$
    - Result: $I_{2010} = -847.58$ bn USD

**Next Period's State Variables (for Year 2015, $t=7$):**

- **Labor Force ($L_{2015}$):**

  - Formula: $L_{t+1} = (1+n) L_t$
  - Plug-in: $L_{2015} = (1+0.00717) \times 447.07$
  - Result: $L_{2015} \approx 450.28$ million

- **Capital Stock ($K_{2015}$):**

  - Formula: $K_{t+1} = (1-\delta) K_t + I_t$
  - Plug-in: $K_{2015} = (1-0.10) \times (-174.94) + (-847.58)$
  - Result: $K_{2015} \approx -1005.03$ bn USD

- **TFP ($A_{2015}$):**
  - Formula: $A_{t+1} = A_t (1 + g + \theta \cdot openness_t + \phi \cdot fdi\_ratio_t)$
  - Plug-in: $A_{2015} = 0.47812 \times (1 + 0.005 + 0.1453 \times 0 + 0.10 \times 0.02)$
  - Result: $A_{2015} \approx 0.48147$

---

## Round 7: Year 2015

_(Computes current variables for 2015 and state variables for 2020)_

**Inputs for Year 2015 ($t=7$):**

- Player Controls: $x_{2015} = 1.0$, $s_{2015} = 0.20$
- Exogenous Variables (from table for 2015):
  - $\tilde e_{2015} = 7.27$
  - $fdi\_ratio_{2015} = 0.02$
  - $Y^*_{2015} = 2813.86$
  - $H_{2015} = 2.60$
- State Variables (from end of Round 6):
  - $K_{2015} \approx -1005.03$ bn USD (implies $Y_{2015}=0$)
  - $L_{2015} \approx 450.28$ million
  - $A_{2015} \approx 0.48147$

**Computation Steps for Year 2015 ($t=7$):**

- $Y_{2015} = 0$
- $e_{2015} = 1.0 \times 7.27 = 7.27$
- $X_{2015} = 18.10 \times (\frac{7.27}{0.78})^{1.5} \times (\frac{2813.86}{1000.00})^{1.0} \approx 1444.73$ bn USD
- $M_{2015} = 0$ (since $Y_{2015}=0$)
- $NX_{2015} = 1444.73$ bn USD
- $openness_{2015} = 0$ (by convention for $Y_t=0$)
- $C_{2015} = 0$
- $I_{2015} = (0.20 \times 0) - 1444.73 = -1444.73$ bn USD

**Next Period's State Variables (for Year 2020, $t=8$):**

- $L_{2020} = (1+0.00717) \times 450.28 \approx 453.51$ million
- $K_{2020} = 0.90 \times (-1005.03) - 1444.73 \approx -2349.26$ bn USD
- $A_{2020} = 0.48147 \times (1 + 0.005 + 0 + 0.10 \times 0.02) \approx 0.48484$

---

## Round 8: Year 2020

_(Computes current variables for 2020 and state variables for 2025)_

**Inputs for Year 2020 ($t=8$):**

- Player Controls: $x_{2020} = 1.0$, $s_{2020} = 0.20$
- Exogenous Variables (from table for 2020):
  - $\tilde e_{2020} = 7.00$
  - $fdi\_ratio_{2020} = 0.02$
  - $Y^*_{2020} = 3262.04$
  - $H_{2020} = 6.71$
- State Variables (from end of Round 7):
  - $K_{2020} \approx -2349.26$ bn USD (implies $Y_{2020}=0$)
  - $L_{2020} \approx 453.51$ million
  - $A_{2020} \approx 0.48484$

**Computation Steps for Year 2020 ($t=8$):**

- $Y_{2020} = 0$
- $e_{2020} = 1.0 \times 7.00 = 7.00$
- $X_{2020} = 18.10 \times (\frac{7.00}{0.78})^{1.5} \times (\frac{3262.04}{1000.00})^{1.0} \approx 1585.81$ bn USD
- $M_{2020} = 0$
- $NX_{2020} = 1585.81$ bn USD
- $openness_{2020} = 0$
- $C_{2020} = 0$
- $I_{2020} = (0.20 \times 0) - 1585.81 = -1585.81$ bn USD

**Next Period's State Variables (for Year 2025, $t=9$):**

- $L_{2025} = (1+0.00717) \times 453.51 \approx 456.77$ million
- $K_{2025} = 0.90 \times (-2349.26) - 1585.81 \approx -3700.14$ bn USD
- $A_{2025} = 0.48484 \times (1 + 0.005 + 0 + 0.10 \times 0.02) \approx 0.48824$

---

## Round 9: Year 2025

_(Computes current variables for 2025. This is the final round in this simulation setup)_

**Inputs for Year 2025 ($t=9$):**

- Player Controls: $x_{2025} = 1.0$, $s_{2025} = 0.20$
- Exogenous Variables (from table for 2025):
  - $\tilde e_{2025} = 6.41$ (uses 2024 value)
  - $fdi\_ratio_{2025} = 0.02$
  - $Y^*_{2025} = 3781.60$
  - $H_{2025} = 6.49$ (uses 2022 value)
- State Variables (from end of Round 8):
  - $K_{2025} \approx -3700.14$ bn USD (implies $Y_{2025}=0$)
  - $L_{2025} \approx 456.77$ million
  - $A_{2025} \approx 0.48824$

**Computation Steps for Year 2025 ($t=9$):**

- $Y_{2025} = 0$
- $e_{2025} = 1.0 \times 6.41 = 6.41$
- $X_{2025} = 18.10 \times (\frac{6.41}{0.78})^{1.5} \times (\frac{3781.60}{1000.00})^{1.0} \approx 1615.94$ bn USD
- $M_{2025} = 0$
- $NX_{2025} = 1615.94$ bn USD
- $openness_{2025} = 0$
- $C_{2025} = 0$
- $I_{2025} = (0.20 \times 0) - 1615.94 = -1615.94$ bn USD

---

**End of Simulation**
The simulation concludes here. With the default saving rate of 0.20 and exchange rate policy of 1.0, the model economy experiences a collapse due to persistently negative investment leading to a depletion of the capital stock.
