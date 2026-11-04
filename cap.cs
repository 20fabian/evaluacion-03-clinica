using System;
using System.Drawing;
using System.Windows.Forms;
class Cap {
  [STAThread]
  static void Main(string[] args) {
    var b = Screen.PrimaryScreen.Bounds;
    using (var bmp = new Bitmap(b.Width, b.Height)) using (var g = Graphics.FromImage(bmp)) {
      g.CopyFromScreen(b.Location, Point.Empty, b.Size);
      bmp.Save(args[0], System.Drawing.Imaging.ImageFormat.Png);
    }
  }
}
