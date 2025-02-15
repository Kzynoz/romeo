import Customer from "../models/customer.model";

const remove = async (req, res, next) => {
  const { id } = req.body;
  try {
    const [response] = await Customer.delete(id);

    if (response.affectedRows) {
      res.status(400).json({ message: "Tuteur supprimé." });
      return;
    }
    res.status(400).json({
      message: "Ce tuteur n'existe pas.",
    });
  } catch (error) {
    next(error);
  }
};

export { remove };
