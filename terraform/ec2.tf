resource "aws_instance" "web-server-2" {
  ami                   = "ami-020cba7c55df1f615"
  instance_type         = "m7i-flex.large"
  key_name              = "kmirim"
  vpc_security_group_ids = [aws_security_group.bt-avantiSG.id]
  user_data             = file("script.sh")

  tags = {
    Name = "web-server-2"
  }
}