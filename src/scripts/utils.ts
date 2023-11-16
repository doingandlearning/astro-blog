export function getMetaImage(title: string) {
  return `https://res.cloudinary.com/kc-cloud/w_1200,f_auto/l_text:Montserrat_80_bold:${encodeURIComponent(
    title.length > 60 ? title.substr(0, 60) + "..." : title
  )},co_rgb:eee,c_fit,w_720,g_north_east,x_70,y_70//v1616954922/ogimages/base_wfdl2u.png`;
}
