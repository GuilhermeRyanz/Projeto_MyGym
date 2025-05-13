class LoteActions:

    @staticmethod
    def cal_unit_price(quantidade, preco_total):
        """
        Calculate the unit price of the product based on the total price and quantity.
        """
        if quantidade > 0:
            preco_unitario = quantidade * preco_total
        else:
            raise ValueError("Quantidade deve ser maior que zero.")

        return preco_unitario
