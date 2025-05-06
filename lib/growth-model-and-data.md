# Open-Economy Growth Model for China (1980–2025)

## Variables

### Endogenous

| Symbol              | Definition                | Units    |
| :------------------ | :------------------------ | :------- |
| $Y_t$               | Real GDP                  | bn USD   |
| $K_t$               | Physical capital stock    | bn USD   |
| $L_t$               | Labor force               | million  |
| $H_t$               | Human-capital index       | index    |
| $A_t$               | Total factor productivity | index    |
| $NX_t$              | Net exports               | bn USD   |
| $C_t$               | Consumption               | bn USD   |
| $I_t$               | Investment                | bn USD   |
| $openness\_ratio_t$ | (Exports + Imports) / GDP | fraction |

### Exogenous

| Symbol         | Definition                                    | Units                |
| :------------- | :-------------------------------------------- | :------------------- |
| $e_t$          | Actual nominal exchange rate                  | CNY per USD          |
| $\tilde e_t$   | Counterfactual floating nominal exchange rate | CNY per USD          |
| $fdi\_ratio_t$ | FDI inflows / GDP                             | fraction             |
| $Y^*_t$        | Foreign income                                | index (1980 = 1000)  |
| $s_t$          | Saving rate                                   | fraction (0.01–0.99) |

### Parameters

| Symbol                          | Definition                                   | Units    | Value       |
| :------------------------------ | :------------------------------------------- | :------- | :---------- |
| $\alpha$                        | Capital share in production                  | unitless | $0.30$      |
| $\delta$                        | Depreciation rate                            | per year | $0.10$      |
| $\eta$                          | Human-capital growth rate                    | per year | $0.020$     |
| $g$                             | Baseline TFP growth rate                     | per year | $0.005$     |
| $n$                             | Labor‐force growth rate                      | per year | $0.00717$   |
| $\theta$                        | Openness contribution to TFP growth          | unitless | $0.1453$    |
| $\phi$                          | FDI contribution to TFP growth               | unitless | $0.10$      |
| $K_0$                           | Initial level of physical capital (1980)     | bn USD   | $2050.10$   |
| $X_0$                           | Initial level of exports (1980)              | bn USD   | $18.10$     |
| $M_0$                           | Initial level of imports (1980)              | bn USD   | $14.50$     |
| $\varepsilon_x,\ \varepsilon_m$ | Exchange‐rate elasticities (exports/imports) | unitless | $1.5,\ 1.2$ |
| $\mu_x,\ \mu_m$                 | Income elasticities (exports/imports)        | unitless | $1.0,\ 1.0$ |

## Paths of exogenous variables

| Year | $e_t$ (CNY/USD) | $\tilde e_t$ (CNY/USD) | $fdi\_ratio_t$ | $Y^*_t$ (index) | Human Capital Index |
| ---: | --------------: | ---------------------: | -------------: | --------------: | ------------------: |
| 1980 |            1.50 |                   0.78 |           0.00 |         1000.00 |                1.58 |
| 1985 |            2.94 |                   1.53 |           0.00 |         1159.27 |                1.77 |
| 1990 |            4.78 |                   2.48 |           0.02 |         1343.92 |                1.80 |
| 1995 |            8.35 |                   4.34 |           0.02 |         1557.97 |                2.02 |
| 2000 |            8.28 |                   5.23 |           0.02 |         1806.11 |                2.24 |
| 2005 |            8.19 |                   4.75 |           0.02 |         2093.78 |                2.43 |
| 2010 |            6.77 |                   5.61 |           0.02 |         2427.26 |                2.61 |
| 2015 |            6.23 |                   7.27 |           0.02 |         2813.86 |                2.60 |
| 2020 |            6.90 |                   7.00 |           0.02 |         3262.04 |                6.71 |

## 8. Model Equations

- **Production:**  
  $$Y_t = A_t\,K_t^{\alpha}\,(L_t\,H_t)^{1-\alpha}$$

- **Capital accumulation:**  
  $$K_{t+1} = (1-\delta)\,K_t + I_t$$

- **Investment:**  
  $$I_t = s\,Y_t + NX_t$$

- **Consumption:**  
  $$C_t = (1-s)\,Y_t$$

- **Labor force:**  
  $$L_{t+1} = L_t\,(1+n)$$

- **Human capital:**  
  $$H_{t+1} = H_t\,(1+\eta)$$

- **TFP growth:**  
  $$A_{t+1} = A_t\bigl[1 + g + \theta\,openness\_ratio_t + \phi\,fdi\_ratio_t\bigr]$$

- **Net exports:**

  $$
    NX_t
    = X_0\Bigl(\tfrac{e_t}{e_{1980}}\Bigr)^{\varepsilon_x}
      \Bigl(\tfrac{Y^*_t}{Y^*_{1980}}\Bigr)^{\mu_x}
    - M_0\Bigl(\tfrac{e_t}{e_{1980}}\Bigr)^{-\varepsilon_m}
      \Bigl(\tfrac{Y_t}{Y_{1980}}\Bigr)^{\mu_m}\,.
  $$

- **Openness ratio:**  
  $$openness\_ratio_t \;=\; \frac{X_t + M_t}{Y_t}$$

## 9. Computation Steps

1. Read $(K_t,L_t,H_t,A_t)$ and choices $(s,e_{policy})$.
2. Compute $\bar R_t$ and then $\tilde e_t$.
3. Set $e_t$ by policy.
4. Compute flows $Y_t,\,NX_t,\,I_t,\,C_t$.
5. Update stocks for $t+1$ and record results.

## 6. Round-by-Round Calendar

Each round $r=0,\dots,9$ covers years $1980+5r$ to $1984+5r$.

## 3. Student-Determined (Each Round)

- **$s\in[0.01,0.99]$** (savings rate)
- **Exchange-rate policy** sets

  $$
  e_t = \begin{cases}
    1.2\,\tilde e_t, & \text{undervalue}\\
    \tilde e_t,      & \text{market}\\
    0.8\,\tilde e_t, & \text{overvalue}
  \end{cases}
  $$

  # China Economic Data (1980–2024)

| Year | Exports (US$ bn) | Imports (US$ bn) | GDP (bn USD) | Capital Stock (2017 USD bn) | Labor Force (million) | Human Capital Index | TFP (2017 = 1) | Consumption (bn USD) | Investment (bn USD) | FX Rate (CNY/USD) | Counterfactual Floating Nominal Rate (CNY/USD) |
| ---: | ---------------: | ---------------: | -----------: | --------------------------: | --------------------: | ------------------: | -------------: | -------------------: | ------------------: | ----------------: | ---------------------------------------------: |
| 1980 |            19.41 |            21.84 |       191.15 |                     2050.10 |                428.30 |                1.58 |          0.832 |               123.65 |               66.15 |              1.50 |                                           0.78 |
| 1985 |            25.80 |            38.30 |       309.49 |                     3062.30 |                496.80 |                1.77 |          0.878 |               201.39 |              120.90 |              2.94 |                                           1.53 |
| 1990 |            49.13 |            38.46 |       360.85 |                     4507.30 |                550.80 |                1.80 |          0.805 |               229.68 |              123.26 |              4.78 |                                           2.48 |
| 1995 |           131.86 |           119.90 |       734.55 |                     7287.10 |                629.00 |                2.02 |          0.869 |               433.84 |              285.28 |              8.35 |                                           4.34 |
| 2000 |           253.09 |           224.31 |      1211.35 |                    12185.20 |                679.50 |                2.24 |          0.810 |               770.06 |              406.69 |              8.28 |                                           5.23 |
| 2005 |           773.34 |           648.71 |      2285.97 |                    21265.50 |                748.70 |                2.43 |          0.895 |              1243.21 |              922.30 |              8.19 |                                           4.75 |
| 2010 |          1654.82 |          1432.42 |      6086.00 |                    39311.20 |                783.00 |                2.61 |          1.031 |              2977.44 |             2833.95 |              6.77 |                                           5.61 |
| 2015 |          2362.10 |          2003.26 |     11061.00 |                    68791.70 |                797.00 |                2.60 |          1.019 |              5972.23 |             4782.44 |              6.23 |                                           7.27 |
| 2020 |          2729.88 |          2374.74 |     14723.00 |                   100000.00 |                787.10 |                6.71 |          0.936 |              8071.33 |             6370.00 |              6.90 |                                           7.00 |
| 2021 |          3554.11 |          3093.28 |     17734.10 |                   102500.00 |                786.00 |                6.52 |          0.951 |              9420.00 |             6840.00 |              6.45 |                                           7.21 |
| 2022 |          3717.89 |          3140.04 |     17882.00 |                   105000.00 |                783.00 |                6.49 |          0.961 |             10000.00 |             7520.00 |              6.73 |                                           7.15 |
| 2023 |          3513.24 |          3127.20 |     18273.00 |                   107500.00 |                780.00 |                 n/a |          0.971 |             10500.00 |             7270.00 |              7.07 |                                           6.57 |
| 2024 |          3580.00 |          2590.00 |     19530.00 |                   110000.00 |                778.00 |                 n/a |          0.979 |             11250.00 |             7500.00 |              7.00 |                                           6.41 |

# Data Sources for Corrected China Economic Data

- **GDP:** World Bank, World Development Indicators (1980-2023), IMF WEO projections (2024).
- **Capital Stock:** Penn World Table 10.01 (1980-2019), estimates post-2020 based on historical trends and investment data.
- **Labor Force:** World Bank / International Labour Organization (ILO) data.
- **Exports and Imports:** World Bank (1980-2023), World Development Indicators, Trading Economics (2024).
  - World Bank - Exports: https://api.worldbank.org/v2/country/CN/indicator/NE.EXP.GNFS.CD?date=1980:2023&format=json - Imports:
    https://api.worldbank.org/v2/country/CN/indicator/NE.IMP.GNFS.CD?date=1980:2023&format=json
  - Trading Economics
    - Exports: https://tradingeconomics.com/china/exports
    - Imports: https://tradingeconomics.com/china/imports
- **Human Capital Index:**
  - 1980-2019 from Penn World Table 10.01 Human Capital Index.
  - 2019-2022 from China Human Capital Index from the Center for Human Capital and Labor Market Research at Central University of Finance and Economics (CUFE), CPI-adjusted for entire country (2020-2022). Values normalized to match the Penn World Table number for 2015, then use growth rate of CUFE series from 2015 onward to create the human capital index series used. The annual value is the average of the two semi-annual values.
- **TFP (Total Factor Productivity):** Penn World Table 10.01 TFP Index (1980-2019), values post-2019 assumed based on:
  - Start from the last reliable official figure (2019 TFP from PWT).
  - Apply a negative adjustment for the year 2020, reflecting economic disruptions from COVID-19. This negative adjustment was presumably informed by GDP and productivity impacts documented by institutions like the IMF, World Bank, or OECD during the pandemic.
  - From 2021 onward, positive adjustments (gradual increases in TFP) were made, assuming partial recovery in productivity growth, possibly guided by international forecasts (e.g., IMF World Economic Outlook).
- **Consumption:** World Bank World Development Indicators (Final Consumption Expenditure), adjusted to match GDP accurately.
- **Investment:** World Bank World Development Indicators (Gross Capital Formation).
- **Nominal Exchange Rate (CNY/USD):** Historical official exchange rates (IMF International Financial Statistics, World Bank, historical accounts).
- **Real Exchange Rate:** Bank for International Settlements (2025), Effective exchange rates, BIS WS_EER 1.0 (data set), https://data.bis.org/topics/EER/BIS%2CWS_EER%2C1.0/M.R.B.CN (accessed on 29 April 2025).
- **Counterfactual Floating Nominal Exchange Rate:** Models a hypothetical nominal exchange rate that would have been the market exchange rate if China had a floating exchange rate regime, computed as follows:

  - **Annual real exchange rate is average of monthly observations**  
    $$\bar R_t = \frac{1}{12}\sum_{m=1}^{12}R_{t,m},\quad R_{t,m}\text{ from BIS series described above}$$

  - **Normalize**  
    $$\tilde e_{2020} = 7.00$$

  - **Counterfactual**  
    $$\tilde e_t = 7.00 \times \frac{\bar R_t}{100}$$

  - **Backfill** for \(t<1994\), let \(t*1=1995\):  
     $$\tilde e_t = e^{\text{nom}}\_t \times \frac{\tilde e*{t*1}}{e^{\text{nom}}*{t_1}}$$
  where $e^{\text{nom}}_t$ is the observed realized nominal exchange rate.

  # Economics-Themed Team Names for Classroom Game

---

## 🌡️ Inflation, Risk Premia, Interest Rates

1. **The Inflators**
2. **Premia Donnas**
3. **The Real Yields**
4. **2% and Furious**
5. **Risky Business Majors**
6. **The Nominal Nonsense**
7. **Fed Up and Rising**
8. **Duration Nation**
9. **Curve Flatteners**
10. **The Discounted Crew**
11. **QE Cuties**
12. **Revenge of the Basis Points**
13. **Taylor Rule Breakers**
14. **Zero Lower Bounders**
15. **The Term Structure Squad**
16. **Stagflation Sensations**
17. **Break-Even Bandits**
18. **Hawks, Doves & Shenanigans**
19. **Forward Guidance Counselors**
20. **Tipsy with TIPS**

---

## 🐉 China, Secular Stagnation, Tariffs, Trade

21. **Great Wall of Tariffs**
22. **Export or Die Trying**
23. **The Red Supply Chain**
24. **Stagnation Nation**
25. **Made in China, Priced Abroad**
26. **The Long March to Demand**
27. **Wokeflation Warriors**
28. **The Trade Deficitists**
29. **Ghost City Tycoons**
30. **Xi's Invisible Hand**
31. **Belt, Road, and Beyond**
32. **The Tariffic Trio**
33. **Low Rates, High Stakes**
34. **Stimulus & Soybeans**
35. **The Renminbi Riddlers**
36. **Unbalanced but Ambitious**
37. **The Great Decouplers**
38. **Import Export Emporium**
39. **The Demographic Timebombers**
40. **Losing My Supply Chain**

---

## 🌀 Mixed Themes: Macro Mayhem

41. **The PBOC Pivoteers**
42. **Tariff and Error**
43. **Yield Curve of the Yangtze**
44. **Stagnation with Chinese Characteristics**
45. **Exporting Inflation Since '08**
46. **The Premia Warriors**
47. **Quantitative Easing with Chinese Spice**
48. **The Great Wall of Real Rates**
49. **Red Capital, Negative Rates**
50. **Ghost Malls & Forward Guidance**
51. **Secularly Doomed But Hedged**
52. **Crouching Premia, Hidden Demand**
53. **Renminbi Raiders**
54. **The Belt and Road Rate Hike**
55. **Risk-On in the Middle Kingdom**
56. **The Low Interest Club of Shanghai**
57. **Stimulus & Stagnation Bros. Ltd.**
58. **Too Much Saving, Not Enough Fun**
59. **From Trade Surplus to Liquidity Trap**
60. **Flat Curves & Floating Yuan**

---

## 👨‍🏫 Economist Puns – Academic & Playful

61. **The Keynes to Success**
62. **Adam's Wealth of Smithies**
63. **Friedman's Free Marketeers**
64. **The Marx Brothers**
65. **Hayek's Road Crew**
66. **Pigou's Taxers**
67. **The Malthusian Optimists**
68. **Ricardo's Comparative Advantagers**
69. **Veblen's Conspicuous Consumers**
70. **The Galbraith Giants**
71. **Nash's Equilibrium Seekers**
72. **Schumpeter's Creative Destroyers**
73. **The Samuelson Solvers**
74. **Arrow's Impossibility Team**
75. **Solow's Growth Models**
76. **The Stiglitz Stigmas**
77. **Coase Theorem Provers**
78. **Krugman's Trade Warriors**
79. **Sen's Capability Approach**
80. **The Behavioral Thalers**

---

## 🛡️ Economist Puns – Team-Style Names

81. **The Keynesian Knights**
82. **Smith's Invisible Hands**
83. **Friedman's Freedom Fighters**
84. **Marx's Manifesto Makers**
85. **Hayek's Heroes**
86. **Pigou's Tax Tigers**
87. **Malthus Population Panthers**
88. **Ricardo's Raiders**
89. **Veblen's Vanguards**
90. **Galbraith's Gladiators**
91. **Nash's Navigators**
92. **Schumpeter's Storm**
93. **Samuelson's Scholars**
94. **Arrow's Archers**
95. **Solow's Stars**
96. **Stiglitz Strikers**
97. **Coase's Commandos**
98. **Krugman's Crusaders**
99. **Sen's Sentinels**
100.  **Thaler's Titans**
