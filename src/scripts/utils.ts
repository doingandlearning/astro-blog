export function getMetaImage(title: string) {
  return `https://res.cloudinary.com/kc-cloud/w_1200,f_auto/l_text:Montserrat_80_bold:${encodeURIComponent(
    title.length > 60 ? title.substr(0, 60) + "..." : title
  )},co_rgb:eee,c_fit,w_720,g_north_east,x_70,y_70//v1616954922/ogimages/base_wfdl2u.png`;
}

export function isPrime(n: number) {
  if (n <= 1) {
    return false;
  }

  if (n <= 3) {
    return true;
  }

  if (n % 2 === 0 || n % 3 === 0) {
    return false;
  }

  for (let i = 5; i * i <= n; i = i + 6) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
  }

  return true;
}
