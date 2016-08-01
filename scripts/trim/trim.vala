int main(string[] args) {
  try {
    var parser = new Json.Parser();
    parser.load_from_file(args[1]);
    var generator = new Json.Generator();
    generator.set_root(parser.get_root());
    generator.to_file(args[2]);
  } catch (Error e) {
    error("%s", e.message);
  }
  return 0;
}
