import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageSelectorComponent } from '../../../shared/language-selector/language-selector.component';

@Component({
  selector: 'accounts-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent],
  template: `
    <div class="bg-gray-50 font-[sans-serif] text-[#333]">
      <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <header class="mb-12">
          <svg
            class="h-12"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="456px"
            height="167px"
            viewBox="0 0 456 167"
            enable-background="new 0 0 456 167"
          >
            <path
              style="
            opacity: 1;
            fill: var(--tui-primary);
            fill-opacity: 1;
            stroke-linecap: round;
            stroke-linejoin: round;
            stop-color: #000000;
          "
              d="M 83.277344 0 C 37.14211 9.4739031e-15 0 37.14211 0 83.277344 L 0 83.722656 C 9.4739031e-15 129.85789 37.14211 167 83.277344 167 L 372.72266 167 C 418.8579 167 456 129.85789 456 83.722656 L 456 83.277344 C 456 37.14211 418.8579 0 372.72266 0 L 83.277344 0 z M 152.31445 43.792969 C 168.89585 43.792969 179.86768 47.590842 188.36523 56.269531 C 191.11812 59.081091 194.22443 63.274611 195.26758 65.587891 C 196.31072 67.901181 197.43471 69.781768 197.76367 69.767578 C 198.09264 69.753378 199.16388 68.000094 200.14453 65.871094 C 204.63566 56.120874 215.69532 47.782022 227.43555 45.294922 C 235.49224 43.588162 249.28678 43.356891 256.90039 44.800781 C 269.09468 47.113381 280.61209 55.409694 285.75977 65.589844 L 288.45703 70.923828 L 290.84375 65.830078 C 292.15638 63.027558 295.62112 58.472354 298.54297 55.708984 C 307.59442 47.148505 317.56844 43.777937 333.74805 43.810547 C 353.35227 43.850047 365.90987 49.520795 374.4375 62.183594 L 377.86133 67.265625 L 377.86133 55.529297 L 377.86133 43.792969 L 388.36133 43.792969 L 398.86133 43.792969 L 398.86133 79.337891 L 398.86133 114.88477 L 396.40625 117.33789 C 394.20697 119.53718 393.11501 119.79297 385.90625 119.79297 L 377.86133 119.79297 L 377.86133 112.79297 L 377.86133 105.79297 L 383.90625 105.79297 C 388.99155 105.79297 390.34155 105.4026 392.40625 103.33789 C 393.75625 101.98789 394.86133 99.942969 394.86133 98.792969 C 394.86133 95.390723 390.481 91.792969 386.33984 91.792969 C 381.17034 91.792969 379.19743 93.196161 376.28906 98.935547 C 372.82459 105.77235 366.13925 112.03837 358.07617 116.00781 L 351.40234 119.29297 C 341.43258 121.34039 322.8633 122.37383 309.68164 116.12891 C 301.33009 112.17229 294.90667 106.32453 291.25586 99.351562 L 288.43555 93.964844 L 285.13281 99.923828 L 281.83008 105.88477 L 284.27734 109.09375 C 287.84806 113.77521 288.98633 117.48505 288.98633 124.43359 C 288.98633 135.077 282.67854 144.21901 271.91211 149.17969 C 267.83757 151.05705 265.13739 151.31238 246.11133 151.62109 C 226.54785 151.93852 224.86133 151.8295 224.86133 150.24609 C 224.86133 146.33415 227.48311 140.23758 230.4375 137.2832 C 234.4611 133.2596 240.23949 131.66338 253.55273 130.90039 C 263.5681 130.3264 264.26608 130.14499 266.15625 127.60742 C 267.90203 125.2637 267.99919 124.53997 266.91797 121.92969 C 265.36906 118.19028 263.98047 117.64463 259.29102 118.93945 C 257.21707 119.51209 248.87642 119.81877 240.43945 119.63086 C 225.62625 119.30093 225.16652 119.22416 218.55469 115.9668 C 210.74864 112.12111 203.16258 105.0039 200.44727 98.982422 C 199.40812 96.677992 198.28694 94.792969 197.95703 94.792969 C 197.62712 94.792969 196.28937 96.805675 194.98438 99.265625 C 191.74864 105.36506 183.06678 113.33936 176.11328 116.59766 C 161.68393 121.46989 135.99268 121.49051 123.11133 113.21484 L 117.86133 109.77344 L 117.86133 114.7832 L 117.86133 119.79297 L 105.04297 119.79297 C 90.591174 119.79297 84.169732 118.39988 76.664062 113.63477 C 70.700362 109.8486 65.693264 104.31175 62.146484 97.580078 C 59.364324 92.299652 59.361082 92.268929 59.044922 69.042969 L 58.728516 45.792969 L 69.794922 45.792969 L 80.861328 45.792969 L 80.861328 65.478516 C 80.861328 83.493726 81.041132 85.532789 82.982422 89.542969 C 86.348592 96.496545 91.378562 99.215984 101.68555 99.652344 C 109.62714 99.988564 110.10926 99.894464 109.375 98.152344 C 106.20257 90.625348 105.6888 87.829737 106.07617 80.185547 C 106.57828 70.277257 109.59995 63.421474 116.59766 56.308594 C 124.94864 47.820185 136.44122 43.792969 152.31445 43.792969 z M 332.95312 63.904297 C 330.0822 63.928001 327.20521 64.200434 324.57031 64.748047 C 307.25583 68.346527 303.60642 90.014311 319.0293 97.648438 C 324.66163 100.43637 342.04217 100.76164 347.16016 98.175781 C 354.44781 94.493695 357.86133 89.407556 357.86133 82.228516 C 357.86133 76.020596 354.55576 70.285424 349.15625 67.121094 C 345.55301 65.009458 339.26916 63.852147 332.95312 63.904297 z M 150.86914 63.917969 C 139.96639 64.126897 133.00018 67.96513 129.63086 75.582031 C 125.94913 83.905191 129.58927 93.470721 138.0293 97.648438 C 144.13837 100.67235 161.04196 100.76259 166.84375 97.802734 C 177.21405 92.512208 180.03722 79.618263 172.66406 71.220703 C 168.25083 66.194313 164.63064 64.657191 155.7832 64.050781 C 154.06399 63.932943 152.42668 63.888122 150.86914 63.917969 z M 243.92578 63.923828 C 237.66643 63.862563 231.33897 64.957959 227.78906 66.953125 C 217.66588 72.642665 215.70988 86.883345 224.01562 94.421875 C 228.90783 98.862181 231.89981 99.712106 242.79492 99.753906 C 251.43837 99.787106 253.98165 99.428975 257.61133 97.671875 C 268.69424 92.306739 270.80111 78.195287 261.79883 69.623047 C 258.90469 66.867167 256.5007 65.651767 252.15234 64.748047 C 249.6019 64.217987 246.77094 63.951676 243.92578 63.923828 z "
            />
          </svg>
        </header>
        <main class="max-w-md w-full border py-12 px-6 rounded-lg border-gray-300 bg-white">
          <router-outlet></router-outlet>
        </main>
        <footer class="mt-4">
          <accounts-language-selector size="s"></accounts-language-selector>
          <p class="text-sm text-gray-500 mt-8">&copy; 2023 Bonsquare - All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}